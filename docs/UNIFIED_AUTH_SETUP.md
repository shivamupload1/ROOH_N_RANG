# Unified authentication setup

The Website owns the only Login and Signup UI. Admin and Gallery consume a
single-use database handoff and then create their own HttpOnly session.

## Supabase Auth

Set the Site URL to:

`https://rooh-n-rang.vercel.app`

Add these Redirect URLs:

- `https://rooh-n-rang.vercel.app/auth/callback`
- `http://localhost:3000/auth/callback`

Enable:

- Email and password
- Confirm email
- Google provider

Public signup creates a `GUEST`. Only Admin client-management code promotes an
email to `CLIENT`; no signup request can choose a role.

## SMTP

In Supabase Dashboard, open Authentication, Email, SMTP and use:

- Sender name: `Rooh N Rang`
- Sender email: `shivamupload1@gmail.com`
- Reply-to: `shivamupload1@gmail.com`
- Host: `smtp.gmail.com`
- Port: `465`
- Username: `shivamupload1@gmail.com`
- Password: a Google App Password

Do not use the normal Gmail password. Google two-step verification must be on
before creating an App Password.

## Vercel environment

All three apps use the same Supabase project and database values.

Website:

- `WEBSITE_URL`
- `ADMIN_URL`
- `GALLERY_URL`
- the matching three `NEXT_PUBLIC_*_URL` values
- Supabase URL and publishable key

Admin and Gallery:

- Supabase URL and publishable key
- database URLs
- the same strong `AUTH_SESSION_SECRET`
- `WEBSITE_URL`, `ADMIN_URL`, and `GALLERY_URL`

Gallery also keeps `JWT_SECRET` for the per-gallery PIN session.

## Gallery access

1. Visitor opens a unique gallery link.
2. Gallery sends unauthenticated visitors to the Website Login/Signup drawer.
3. Website verifies the account and creates a 90-second, single-use handoff.
4. Gallery consumes the handoff and displays the cover-photo PIN overlay.
5. A correct PIN creates a browser-session gallery unlock and records the
   visitor-to-gallery access history.
