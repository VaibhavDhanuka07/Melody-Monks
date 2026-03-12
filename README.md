# Melody Monks | Vasu Guitar Academy

Premium music academy platform for guitarist Vasu (Debojeet Lahiri).

## Stack

Frontend:
- Next.js 14 (App Router)
- React + TypeScript
- Tailwind CSS
- Framer Motion
- Tone.js + Web Audio API

Backend:
- Node.js + Express
- Supabase (database)

## Project Structure

- `/frontend` Next.js app
- `/backend` Express API
- `/backend/supabase` database schema

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
NEXT_PUBLIC_WHATSAPP_MESSAGE=Hi, I want to book a free guitar trial class.
```

Backend (`/backend/.env.example`):

```
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_ANON_KEY=
CORS_ORIGIN=http://localhost:3000
WHATSAPP_NUMBER=91XXXXXXXXXX
WHATSAPP_MESSAGE=Hi, I want to book a free guitar trial class.
PORT=5001
```

## Media Assets

Place real photos and videos here:

- `/frontend/public/vasu` (portraits, teaching, performance photos)
- `/frontend/public/videos` (hero and performance MP4 files)

## Supabase Schema

Use `backend/supabase/schema.sql` to create required tables, including `trial_bookings` for free trial leads.

## Deployment

Frontend is optimized for Vercel. Backend can be deployed on any Node.js host (Render, Railway, Fly, etc.).
