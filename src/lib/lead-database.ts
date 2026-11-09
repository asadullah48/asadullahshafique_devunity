import { Pool } from "pg";
import type { LeadInput } from "./leads";
let pool: Pool;
export function leadDatabase() {
  if (!process.env.DATABASE_URL) throw new Error("Lead database is not configured");
  return pool ??= new Pool({ connectionString: process.env.DATABASE_URL, max: 3, connectionTimeoutMillis: 5000, query_timeout: 5000 });
}
export async function allowSubmission(hash: string) {
  const db = leadDatabase();
  // No visitor identifier is attached to a lead. Old hashes expire after one day.
  await db.query("DELETE FROM contact_rate_limits WHERE window_start < now() - interval '1 day'");
  const result = await db.query(`
    INSERT INTO contact_rate_limits (visitor_hash, window_start, attempts) VALUES ($1, now(), 1)
    ON CONFLICT (visitor_hash) DO UPDATE SET
      attempts = CASE WHEN contact_rate_limits.window_start <= now() - interval '15 minutes' THEN 1 ELSE contact_rate_limits.attempts + 1 END,
      window_start = CASE WHEN contact_rate_limits.window_start <= now() - interval '15 minutes' THEN now() ELSE contact_rate_limits.window_start END
    RETURNING attempts`, [hash]);
  return result.rows[0].attempts <= 3;
}
export async function saveLead(lead: LeadInput) {
  const result = await leadDatabase().query(`
    INSERT INTO contact_messages (name, email, company, enquiry_type, subject, message)
    VALUES ($1, $2, $3, $4, $4, $5) RETURNING id, timestamp`,
    [lead.name, lead.email, lead.company || null, lead.enquiryType, lead.message]);
  return { id: String(result.rows[0].id), timestamp: new Date(result.rows[0].timestamp) };
}
export async function markAlert(id: string, status: "sent" | "failed") {
  await leadDatabase().query("UPDATE contact_messages SET alert_status = $2 WHERE id = $1", [id, status]);
}
