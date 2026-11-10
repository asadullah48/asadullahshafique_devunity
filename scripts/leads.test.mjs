import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateLead, visitorHash, karachiTime } from '../src/lib/leads.ts';
// Synthetic unit fixtures only. No network or database access.
const synthetic = { name: ' Synthetic Visitor ', email: 'synthetic@example.invalid', company: '', enquiryType: 'job', message: 'Synthetic enquiry' };
test('validates and trims a synthetic lead; company is optional', () => {
  assert.equal(validateLead(synthetic)?.name, 'Synthetic Visitor');
  const { company, ...withoutCompany } = synthetic;
  assert.equal(validateLead(withoutCompany)?.company, '');
});
test('rejects malformed, oversized and missing fields', () => {
  for (const value of [null, [], {}, { ...synthetic, email: 'bad' }, { ...synthetic, name: [] }, { ...synthetic, message: 'a'.repeat(5001) }, { ...synthetic, enquiryType: 'unknown' }, { ...synthetic, name: ' ' }]) assert.equal(validateLead(value), null);
});
test('hashes are keyed and rotate daily without retaining the synthetic IP', () => {
  const hash = visitorHash('192.0.2.1', 'synthetic-secret', new Date('2026-11-09T00:00:00Z'));
  assert.match(hash, /^[a-f0-9]{64}$/);
  assert.notEqual(hash, visitorHash('192.0.2.1', 'different-secret', new Date('2026-11-09T00:00:00Z')));
  assert.notEqual(hash, visitorHash('192.0.2.1', 'synthetic-secret', new Date('2026-11-10T00:00:00Z')));
});
test('formats submission time in Karachi', () => {
  assert.match(karachiTime(new Date('2026-11-09T00:00:00Z')), /05:00:00/);
});
