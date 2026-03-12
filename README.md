# Melody Monks Music Academy

Melody Monks by Debojeet Lahiri.

A production-ready global music academy platform built with Next.js 14, Supabase, and interactive audio tools.

## Stack

- Next.js 14 (App Router)
- React + TypeScript
- Tailwind CSS
- Tone.js + Web Audio API
- Supabase (Auth, Database, Storage)

## Getting Started

```bash
npm install
npm run dev
```

## Environment Variables

Create a `.env.local` file in the project root:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Optional payments
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-key
NEXT_PUBLIC_RAZORPAY_KEY_ID=your-razorpay-key
```

## Gallery Assets

- Place photos in `public/gallery`.
- Add video files in `public/gallery` and update `src/data/gallery.ts`.
- Update `instagramItems` in `src/data/gallery.ts` with real post or reel URLs.

## Supabase Schema

See `supabase/schema.sql` for the required tables.

## Deployment

Optimized for Vercel. Run `npm run build` to verify the production build.
