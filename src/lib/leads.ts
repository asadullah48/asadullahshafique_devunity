import { createHmac } from "node:crypto";

export type LeadInput = { name: string; email: string; company: string; enquiryType: "job" | "freelance project" | "other"; message: string };
export function validateLead(body: unknown): LeadInput | null {
  if (!body || typeof body !== "object" || Array.isArray(body)) return null;
  const b = body as Record<string, unknown>;
  const limits = { name: 200, email: 200, company: 200, enquiryType: 30, message: 5000 };
  const result: Record<string, string> = {};
  for (const [key, max] of Object.entries(limits)) {
    const value = b[key] ?? (key === "company" ? "" : undefined);
    if (typeof value !== "string" || value.trim().length > max || (key !== "company" && !value.trim())) return null;
    result[key] = value.trim();
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result.email) || /[\r\n]/.test(result.email)) return null;
  if (!["job", "freelance project", "other"].includes(result.enquiryType)) return null;
  return result as LeadInput;
}
export function visitorHash(ip: string, secret: string, date = new Date()) {
  return createHmac("sha256", secret).update(`${date.toISOString().slice(0, 10)}:${ip}`).digest("hex");
}
export function karachiTime(date: Date) {
  return new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Karachi", dateStyle: "medium", timeStyle: "long" }).format(date);
}
