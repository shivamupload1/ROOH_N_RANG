# ROOH N RANG

Wedding photography platform with three independently deployable applications and one shared Supabase backend.

## Applications

| App | Root | Local URL |
| --- | --- | --- |
| Cinematic website | `apps/website` | `http://localhost:3000` |
| Editorial admin studio | `apps/admin` | `http://localhost:3001/admin` |
| Client galleries | `apps/gallery` | `http://localhost:3002/client-login` |

The approved frontend source remains available at the repository root. Its production copy is served by the Website app from `apps/website/public`.

## Backend

- Supabase Auth for admin sessions
- Supabase Postgres through Prisma
- Supabase Storage for private previews
- Google Drive OAuth for original client files
- Public/PIN gallery access, favorites, selections, and tracked downloads
- Batched Drive sync and preview processing for large galleries

## Commands

```powershell
corepack.cmd pnpm install
npm.cmd run db:generate
npm.cmd run lint
npm.cmd run build:apps
npm.cmd run dev:website
npm.cmd run dev:admin
npm.cmd run dev:gallery
```

Copy `.env.example` to `.env` and fill server credentials locally. Never commit `.env` or any Supabase secret, Google client secret, encryption key, or cron secret.

Deployment roots, environment variables, and release order are documented in `docs/DEPLOYMENT.md`.
