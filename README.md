# Melody Monks Piano Academy

Premium piano learning platform with a cinematic, high-end EdTech experience.

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
NEXT_PUBLIC_WHATSAPP_NUMBER=91XXXXXXXXXX
NEXT_PUBLIC_WHATSAPP_MESSAGE=Hi, I want to book a free piano trial class.
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
```

Backend (`/backend/.env.example`):

```
DATABASE_URL=
CORS_ORIGIN=http://localhost:3000
WHATSAPP_NUMBER=91XXXXXXXXXX
WHATSAPP_MESSAGE=Hi, I want to book a free piano trial class.
PORT=5001
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
