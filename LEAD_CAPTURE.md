# Contact leads setup

The existing contact form and /api/contact route now write directly to the existing
contact_messages table in Postgres. The separate FastAPI contact API is unchanged;
its legacy Discord notification is not used by this Vercel form. Its message-list
endpoint is protected by the existing ADMIN_SECRET token. No authentication or
backend API changes are included. You can reuse an existing Postgres database
with this additive migration, or create a new Neon database.

Add these server-only variables in Vercel (never NEXT_PUBLIC_):

- DATABASE_URL: Neon pooled Postgres URL, including sslmode=require.
- RESEND_API_KEY: your Resend API key.
- RESEND_FROM_EMAIL: a sender address on a domain verified in Resend.
- LEAD_RATE_LIMIT_SECRET: a random secret of at least 32 characters.
- LEAD_ALERT_EMAIL: optional alert recipient; defaults to asadullahshafique@hotmail.com.
- VERCEL: platform-provided; do not set it manually.

The root .env.example contains placeholders only. See docs/LEAD_CAPTURE_GO_LIVE.md
for the staging, rollback and ownership checklist.

Before deployment, manually apply migrations/001-contact-leads.sql to the intended
Neon database. It is additive and contains no test leads. No migration runs during
builds or requests. Existing rows retain their original IDs; their enquiry type
remains NULL because it cannot honestly be inferred. IDs increase but may have gaps.
Postgres stores timestamp instants; emails display them in Asia/Karachi.

The limit is three validated attempts per visitor per 15-minute window. Vercel's
forwarded IP is HMAC hashed with a secret and UTC day. Only the hash is persisted,
in a separate rate-limit table, and is deleted after one day on the next request.
Daily rotation can reset a visitor's limit at UTC midnight. Visitors sharing an IP
share a limit. Outside Vercel a shared local bucket is used. No raw IP is stored
or logged by this code. Hosting access logs are controlled separately by Vercel.

Successful storage returns a reference even if the email provider fails, so a
visitor is not encouraged to duplicate a saved enquiry. alert_status is pending,
sent or failed (sent means accepted by Resend, not inbox delivery). Check failed
and pending rows manually and follow up from the database; there is no automatic
retry worker. Resend requests use the Lead ID as their idempotency key.

Testing: npm run test:leads uses synthetic fixtures and mocked SQL/email calls.
To test actual SQL, create a disposable local Postgres cluster owned by
synthetic_test, set SYNTHETIC_TEST_DATABASE_URL to its localhost connection URL,
and run npm run test:leads:db. The test applies the migration and inserts
clearly labelled synthetic leads into that disposable database only.
Contact browser tests intercept the API; they never submit to a live database.
Use only a separate disposable database for any manual integration tests. Never
point tests at the production database. No live lead or email was created during
implementation. Database integration and actual email delivery need verification
once your Neon and Resend configuration is ready.

No deploy is included in this change.
