import { NextResponse } from "next/server";
import { isIP } from "node:net";
import { validateLead, visitorHash, karachiTime } from "@/lib/leads";
import { allowSubmission, saveLead, markAlert } from "@/lib/lead-database";
export const runtime = "nodejs";
export const maxDuration = 30;

const safeName = (name: unknown) => (typeof name === "string" && /^[\w.-]{1,64}$/.test(name) ? name : "unknown");

export async function POST(request: Request) {
  let body: unknown;
  try {
    // Bound the actual body, including chunked requests.
    const reader = request.body?.getReader();
    if (!reader) return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > 24000) { await reader.cancel(); return NextResponse.json({ error: "Message is too large" }, { status: 413 }); }
      chunks.push(value);
    }
    body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  if (body && typeof body === "object" && "website" in body && (body as { website: unknown }).website) {
    return NextResponse.json({ error: "Unable to accept this submission" }, { status: 400 });
  }
  const lead = validateLead(body);
  if (!lead) return NextResponse.json({ error: "Enter a name, valid email, enquiry type and message (maximum 5,000 characters)." }, { status: 400 });
  const secret = process.env.LEAD_RATE_LIMIT_SECRET;
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const alertEmail = process.env.LEAD_ALERT_EMAIL || "asadullahshafique@hotmail.com";
  if (!secret || secret.length < 32 || !apiKey || !from || !process.env.DATABASE_URL || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(alertEmail)) {
    return NextResponse.json({ error: "Contact form is temporarily unavailable. Please email asadullahshafique@hotmail.com." }, { status: 503 });
  }
  // Vercel overwrites this header. Outside Vercel use a shared local bucket;
  // do not trust arbitrary client-supplied forwarding headers.
  const ip = process.env.VERCEL === "1" ? request.headers.get("x-forwarded-for")?.split(",")[0].trim() : "local";
  if (!ip || (ip !== "local" && !isIP(ip))) return NextResponse.json({ error: "Unable to identify visitor" }, { status: 400 });
  let saved;
  try {
    if (!await allowSubmission(visitorHash(ip, secret))) return NextResponse.json({ error: "Please wait 15 minutes before sending another enquiry." }, { status: 429, headers: { "Retry-After": "900" } });
    saved = await saveLead(lead);
  } catch {
    // Never log request bodies, connection strings or raw database exceptions.
    console.error("Lead persistence failed");
    return NextResponse.json({ error: "Unable to save your enquiry. Please try later or email directly." }, { status: 503 });
  }
  let sent = false;
  let failure = "";
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", "Idempotency-Key": `contact-lead-${saved.id}` },
      signal: AbortSignal.timeout(8000),
      body: JSON.stringify({ from, to: [alertEmail], reply_to: lead.email,
        subject: `Lead #${saved.id}: ${lead.enquiryType}`,
        text: `Lead #${saved.id}\nSubmitted: ${karachiTime(saved.timestamp)} (Asia/Karachi)\nType: ${lead.enquiryType}\nName: ${lead.name}\nEmail: ${lead.email}\nCompany: ${lead.company || "Not provided"}\n\n${lead.message}` }),
    });
    sent = response.ok;
    // Log only Resend's error name: its message can echo addresses.
    if (!sent) failure = `status=${response.status} name=${safeName(await response.json().then((b) => b?.name, () => undefined))}`;
  } catch (error) { failure = `name=${safeName(error instanceof Error ? error.name : undefined)}`; /* The saved lead remains available. */ }
  try { await markAlert(saved.id, sent ? "sent" : "failed"); } catch { console.error("Lead alert status update failed"); }
  if (!sent) console.error(`Lead #${saved.id} saved; alert failed (${failure})`);
  return NextResponse.json({ leadId: saved.id }, { status: 201 });
}
