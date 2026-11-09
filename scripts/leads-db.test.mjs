import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { Pool } from 'pg';
// Safety gate: opt-in localhost-only disposable database. Never use DATABASE_URL from the shell.
const url = process.env.SYNTHETIC_TEST_DATABASE_URL;
if (!url || !['127.0.0.1', 'localhost'].includes(new URL(url).hostname) || new URL(url).username !== 'synthetic_test') throw new Error('Set SYNTHETIC_TEST_DATABASE_URL to the disposable local synthetic_test database');
process.env.DATABASE_URL = url;
const { allowSubmission, saveLead, markAlert, leadDatabase } = await import('../src/lib/lead-database.ts');
const db = new Pool({ connectionString: url });
const migration = await readFile(new URL('../migrations/001-contact-leads.sql', import.meta.url), 'utf8');
await db.query(migration);
await db.query(migration);
try {
  await test('synthetic leads receive increasing IDs, metadata and alert status', async () => {
    const lead = { name: 'Synthetic Visitor', email: 'synthetic@example.invalid', company: 'Synthetic Company', enquiryType: 'job', message: 'Synthetic database test' };
    const a = await saveLead(lead); const b = await saveLead(lead);
    assert.ok(Number(b.id) > Number(a.id));
    assert.ok(a.timestamp instanceof Date);
    assert.match(a.id, /^[1-9][0-9]*$/);
    await markAlert(a.id, 'sent');
    const result = await db.query('SELECT * FROM contact_messages WHERE id=$1', [a.id]);
    assert.equal(String(result.rows[0].id), a.id);
    assert.equal(result.rows[0].company, lead.company);
    assert.equal(result.rows[0].enquiry_type, 'job');
    assert.equal(result.rows[0].alert_status, 'sent');
    assert.equal(result.rows[0].subject, 'job');
  });
  await test('atomic rate limit allows exactly three concurrent synthetic attempts', async () => {
    const hash = 'a'.repeat(64);
    const values = await Promise.all(Array.from({ length: 10 }, () => allowSubmission(hash)));
    assert.equal(values.filter(Boolean).length, 3);
    await db.query("UPDATE contact_rate_limits SET window_start=now()-interval '16 minutes' WHERE visitor_hash=$1", [hash]);
    assert.equal(await allowSubmission(hash), true);
  });
  await test('expired synthetic hashes are removed', async () => {
    await db.query("UPDATE contact_rate_limits SET window_start=now()-interval '2 days'");
    await allowSubmission('b'.repeat(64));
    assert.equal((await db.query('SELECT count(*) FROM contact_rate_limits WHERE visitor_hash=$1', ['a'.repeat(64)])).rows[0].count, '0');
  });
} finally { await db.end(); await leadDatabase().end(); }
