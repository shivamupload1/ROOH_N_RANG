# Rooh N Rang deployment

The repository contains three independently deployable Next.js applications backed by one Supabase project.

| Vercel project | Root directory | Local port | Purpose |
| --- | --- | --- | --- |
| Website | `apps/website` | `3000` | Approved cinematic public website |
| Admin | `apps/admin` | `3001` | Supabase-authenticated studio control room |
| Gallery | `apps/gallery` | `3002` | Public or PIN-protected client galleries |

## Shared backend

- Prisma schema and migrations: `prisma/`
- Shared database client: `packages/database`
- Supabase Auth: admin identity and sessions
- Supabase Postgres: website, client, event, media, selection, and activity data
- Supabase Storage: private compressed gallery previews
- Google Drive: original photo and video files

## Environment matrix

All three projects need `DATABASE_URL`, `DIRECT_URL`, `NEXT_PUBLIC_SUPABASE_URL`, and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.

Website additionally needs the three `NEXT_PUBLIC_*_URL` values so login/admin/gallery redirects reach the correct deployments.

Admin additionally needs Google OAuth values, `TOKEN_ENCRYPTION_KEY`, `CRON_SECRET`, `SUPABASE_SECRET_KEY`, and `INSTAGRAM_ACCESS_TOKEN`.

Gallery additionally needs `JWT_SECRET`, `SUPABASE_SECRET_KEY`, and `SUPABASE_PREVIEW_BUCKET`.

Never expose `SUPABASE_SECRET_KEY`, the legacy service-role key, Google client secret, encryption key, or cron secret as a `NEXT_PUBLIC_*` variable.

## Release order

1. Apply Prisma migrations to Supabase with `npm.cmd run db:migrate:supabase`.
2. Deploy Gallery and record its production URL.
3. Deploy Admin, add its callback URL to Google OAuth, and record its production URL.
4. Deploy Website with the Admin and Gallery URLs configured.
5. Run admin login, Google Drive connection, preview batch, Instagram sync, and gallery access smoke tests.
