import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import pg from 'pg';
import { POST } from '../src/app/api/contact/route.ts';
// Synthetic fixtures. All SQL and email calls are mocked; no connection is opened.
const fixture = { name: 'Synthetic Visitor', email: 'synthetic@example.invalid', company: '', enquiryType: 'job', message: 'Synthetic route test', website: '' };
const request = (body) => new Request('http://localhost/api/contact', { method: 'POST', body: JSON.stringify(body) });
test('contact route validates, limits, saves then alerts using synthetic mocks', async (t) => {
  const original = { ...process.env };
  Object.assign(process.env, { DATABASE_URL: 'postgresql://synthetic_test@127.0.0.1/synthetic', RESEND_API_KEY: 'synthetic-not-a-key', RESEND_FROM_EMAIL: 'synthetic@example.invalid', LEAD_RATE_LIMIT_SECRET: 'synthetic-secret-at-least-32-characters', VERCEL: '0', LEAD_ALERT_EMAIL: 'synthetic-owner@example.invalid' });
  let attempts = 1; let queries = []; let email;
  const query = mock.method(pg.Pool.prototype, 'query', async (sql, values) => {
    queries.push({ sql, values });
    if (sql.includes('RETURNING attempts')) return { rows: [{ attempts }] };
    if (sql.includes('RETURNING id')) return { rows: [{ id: 42, timestamp: new Date('2026-11-09T00:00:00Z') }] };
    return { rows: [] };
  });
  const send = mock.method(globalThis, 'fetch', async (url, options) => { email = JSON.parse(options.body); return new Response('{}', { status: 200 }); });
  try {
    await t.test('rejects malformed input and honeypot without SQL or email', async () => {
      assert.equal((await POST(request({ ...fixture, email: 'invalid' }))).status, 400);
      assert.equal((await POST(request({ ...fixture, website: 'synthetic spam' }))).status, 400);
      assert.equal((await POST(new Request('http://localhost/api/contact', { method: 'POST', body: '{' }))).status, 400);
      assert.equal((await POST(request({ ...fixture, message: 'x'.repeat(25000) }))).status, 413);
      assert.equal(queries.length, 0); assert.equal(send.mock.callCount(), 0);
    });
    for (const key of ['DATABASE_URL', 'RESEND_API_KEY', 'RESEND_FROM_EMAIL', 'LEAD_RATE_LIMIT_SECRET']) {
      await t.test(`missing ${key} returns a safe 503 without SQL or email`, async () => {
        const configured = process.env[key];
        const sqlBefore = queries.length;
        const emailBefore = send.mock.callCount();
        try {
          delete process.env[key];
          const response = await POST(request(fixture));
          assert.equal(response.status, 503);
          assert.deepEqual(await response.json(), { error: 'Contact form is temporarily unavailable. Please email asadullahshafique@hotmail.com.' });
          assert.equal(queries.length, sqlBefore);
          assert.equal(send.mock.callCount(), emailBefore);
        } finally { process.env[key] = configured; }
      });
    }
    await t.test('saves reference and sends Karachi details to the owner', async () => {
      const result = await POST(request(fixture));
      assert.equal(result.status, 201); assert.deepEqual(await result.json(), { leadId: '42' });
      assert.deepEqual(email.to, ['synthetic-owner@example.invalid']);
      assert.equal(email.reply_to, fixture.email); assert.match(email.text, /Lead #42/); assert.match(email.text, /05:00:00/);
      assert.ok(queries.find(q => q.sql.includes('INSERT INTO contact_messages')));
      assert.equal(queries.at(-1).values[1], 'sent');
    });
    await t.test('returns 429 without saving or alerting after the limit', async () => {
      attempts = 4; queries = []; send.mock.resetCalls();
      assert.equal((await POST(request(fixture))).status, 429);
      assert.equal(send.mock.callCount(), 0); assert.ok(!queries.some(q => q.sql.includes('INSERT INTO contact_messages')));
    });
    await t.test('keeps a saved reference when email fails', async () => {
      attempts = 1; queries = []; send.mock.mockImplementation(async () => new Response('{}', { status: 503 }));
      const response = await POST(request(fixture));
      assert.equal(response.status, 201); assert.equal((await response.json()).leadId, '42');
      assert.equal(queries.at(-1).values[1], 'failed');
    });
    await t.test('database failure returns 503 without sending email', async () => {
      send.mock.resetCalls(); query.mock.mockImplementation(async () => { throw new Error('Synthetic DB failure'); });
      assert.equal((await POST(request(fixture))).status, 503); assert.equal(send.mock.callCount(), 0);
    });
  } finally {
    mock.restoreAll();
    for (const key of Object.keys(process.env)) if (!(key in original)) delete process.env[key];
    Object.assign(process.env, original);
  }
});
