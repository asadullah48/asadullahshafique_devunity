# Lead capture go-live checklist

These are manual instructions, not actions performed by the app, build or tests.
Never apply the production migration without reviewing the target database first.

## Environment variables

Required server-only names: DATABASE_URL, RESEND_API_KEY,
RESEND_FROM_EMAIL, LEAD_RATE_LIMIT_SECRET.

Optional server-only name: LEAD_ALERT_EMAIL. It defaults to the portfolio owner's
public contact address, asadullahshafique@hotmail.com. Set it to that owner address
for production if using the example file; example.invalid is a placeholder only.
VERCEL is supplied by Vercel and selects its trusted visitor-IP handling. Do not
set VERCEL locally. SYNTHETIC_TEST_DATABASE_URL is for disposable localhost tests
only and must never be configured on Vercel.

The root .env.example contains placeholders only. Never commit .env, .env.local,
real connection URLs, provider keys or real lead data. Generate a random HMAC
secret of at least 32 characters. Use a verified Resend sender and a pooled Neon
connection with TLS. Give the application a separate database role with only the
permissions needed for inserts, alert updates, returned IDs and rate-limit cleanup;
keep migration privileges separate.

## Go-live steps

1. Confirm database ownership and any existing real contact messages. Back up the
   schema/data and record which tables and columns already exist. Do not infer
   compatibility from CREATE/ADD IF NOT EXISTS: it does not validate existing types.
2. Create an isolated Neon database branch for staging. Use staging credentials,
   not production values, and keep that branch private.
3. Review and manually apply migrations/001-contact-leads.sql to the Neon branch
   first. Do not run the SQL unit-test script against Neon; its gate permits only
   a disposable localhost database.
4. In a staging app connected only to that branch, submit one clearly labelled
   synthetic lead using a controlled test inbox. Check that the numeric reference
   equals contact_messages.id, time is shown in Asia/Karachi, an alert arrives,
   and the honeypot/rate limit work. Never commit the fixture to a live database.
5. After review, manually apply the reviewed additive migration to the intended
   main database. Preserve all existing messages. Do not copy the synthetic lead
   or staging rate-limit rows into the main database.
6. Set the required Vercel environment variables for the intended environment;
   confirm the optional alert recipient. Keep preview/staging database credentials
   separate from production. No DATABASE_URL or key may use NEXT_PUBLIC_.
7. The owner reviews and authorizes deployment separately. Inspect saved leads and
   failed/pending alerts after launch. A saved lead remains successful if Resend
   fails; sent means accepted by the provider, not confirmed inbox delivery.
   There is no automatic retry worker. Legacy rows also default to pending, so do
   not blindly retry all pending rows as new enquiries.

No deploy command or production migration is part of this implementation task.

## Reference number

Postgres generates contact_messages.id from its SERIAL sequence. The insert omits
id and uses RETURNING id, timestamp. The server converts id to a string, returns
it as leadId, and the visitor sees # followed by that value. There is deliberately
no separate reference_id column. Sequence gaps are normal.

## Rollback SQL — destructive, manual only

First roll the app back to compatible code. Back up data and confirm which objects
this migration actually created. IF NOT EXISTS does not track prior ownership.
Do not run either block blindly, against pre-existing objects, or without approval.
These statements delete data in the dropped columns/tables. They do not remove
email copies in Resend or the owner's mailbox. No CASCADE is used.

If contact_messages existed and the migration newly added all three columns and
contact_rate_limits:

```sql
BEGIN;
DROP TABLE contact_rate_limits;
ALTER TABLE contact_messages DROP COLUMN alert_status;
ALTER TABLE contact_messages DROP COLUMN enquiry_type;
ALTER TABLE contact_messages DROP COLUMN company;
COMMIT;
```

Only if both tables were newly created by this migration in an empty database:

```sql
BEGIN;
DROP TABLE contact_rate_limits;
DROP TABLE contact_messages;
COMMIT;
```

If any named object already existed, preserve it and prepare a reviewed rollback
for that database instead. Dropping the contact table also drops its owned SERIAL
sequence. Do not run any rollback merely to test it on a live database.

## Open decisions

- Retention period: proposed default is 12 months after an enquiry is closed,
  unless needed for an ongoing relationship. This is not implemented. Decide who
  handles deletion requests and how inbox/provider copies are handled. The public
  form gives the owner's email for requests; there is no deletion endpoint.
- CAPTCHA later: proposed default is honeypot plus the database rate limit now;
  add CAPTCHA if observed spam justifies it. No CAPTCHA is currently installed.
- Alembic ownership of contact_messages: decide one schema owner before sharing
  this database with the Python backend. Its model lacks company, enquiry_type
  and alert_status and does not model contact_rate_limits. Do not apply generated
  destructive Alembic changes to these objects. The current Alembic env.py is only
  a docstring and does not wire metadata/autogeneration. A future working setup
  would need either matching models or reviewed exclusions for Next.js-owned
  objects. Backend files are unchanged by this feature.

## Privacy and operations

Leads contain name, email, optional company, enquiry type, message and submission
time. No dedicated phone field is stored. Messages can contain personal details.
Raw visitor IPs are not stored by this route; a daily keyed HMAC hash is stored
separately for rate limiting. Expired hash rows are removed on later submissions,
not by a scheduled purge. Hosting access logs are controlled separately.
