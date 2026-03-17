# Melody Monks Indian Music Academy

Premium Indian music learning platform with a cinematic, high-end EdTech experience.

## Stack

Frontend:
- Next.js 14 (App Router)
- React + TypeScript
- Tailwind CSS
- Framer Motion

Backend:
- Node.js + Express
- PostgreSQL + Prisma

Auth:
- Supabase Auth or Firebase Auth (frontend-ready)

## Project Structure

- `/frontend` Next.js app
- `/backend` Express API
- `/backend/prisma` Prisma schema

## Getting Started

```bash
npm install
npm run dev
```

Backend (optional):

```bash
npm run dev:backend
```

## Environment Variables

Frontend (`/frontend/.env.example`):

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:5001
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_WHATSAPP_NUMBER=91XXXXXXXXXX
NEXT_PUBLIC_WHATSAPP_MESSAGE=Hi, I want to book a free Indian music trial class.
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_ADMIN_API_KEY=
```

Backend (`/backend/.env.example`):

```
DATABASE_URL=
DIRECT_URL=
CORS_ORIGIN=http://localhost:3000
WHATSAPP_NUMBER=91XXXXXXXXXX
WHATSAPP_MESSAGE=Hi, I want to book a free Indian music trial class.
PORT=5001
ALLOW_IN_MEMORY_FALLBACKS=true
ENFORCE_HTTPS=false
RATE_LIMIT_ENABLED=true
REDIS_URL=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_JWT_SECRET=
ADMIN_API_KEY=
ADMIN_2FA_SECRET=
REQUIRE_2FA=false
ENCRYPTION_KEY=
CAPTCHA_PROVIDER=turnstile
CAPTCHA_SECRET=
OTEL_SERVICE_NAME=melody-monks-backend
AI_IMAGE_PROVIDER=openai
OPENAI_API_KEY=
OPENAI_IMAGE_MODEL=gpt-image-1
OPENAI_IMAGE_SIZE=1024x1024
OPENAI_IMAGE_QUALITY=high
AI_IMAGE_STYLE=dark cinematic background, premium music academy aesthetic, studio lighting, high detail, no text, no watermark
AI_IMAGE_INLINE=false
```

## Media Assets

Place real photos and videos here:

- `/frontend/public/piano` (portraits, performances, studio shots)
- `/frontend/public/videos` (hero and lesson MP4 files)

## Prisma

Create the database and run migrations:

```bash
npm run prisma:migrate
npm run prisma:generate
```

If your local network blocks Supabase direct connections, use the VPS workflow:
[docs/vps-migrations.md](C:\Users\vaibh\Desktop\Debojeet lehri\docs\vps-migrations.md)

Seed demo data:

```bash
npm run prisma:seed
```

Open Prisma Studio:

```bash
npm run prisma:studio
```

## Deployment

Frontend is optimized for Vercel. Backend can be deployed on Railway or any Node.js host.

## Prisma Deploy (GitHub Actions)

This repo includes a workflow to run `prisma migrate deploy` on pushes that
change Prisma files. Add these GitHub Actions secrets:

- `DATABASE_URL` (direct Supabase connection string)
- `DIRECT_URL` (same direct string)

Workflow file:
[.github/workflows/prisma-deploy.yml](C:\Users\vaibh\Desktop\Debojeet lehri\.github\workflows\prisma-deploy.yml)

Manual migration workflow:
[.github/workflows/prisma-migrate-manual.yml](C:\Users\vaibh\Desktop\Debojeet lehri\.github\workflows\prisma-migrate-manual.yml)

Scheduled deploy workflow (runs daily at 02:00 UTC):
[.github/workflows/prisma-deploy-scheduled.yml](C:\Users\vaibh\Desktop\Debojeet lehri\.github\workflows\prisma-deploy-scheduled.yml)
