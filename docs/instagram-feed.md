# Instagram Feed (Graph API + Supabase)

## 1) Create the table in Supabase

Run the SQL in `backend/supabase/instagram_posts.sql` inside the Supabase SQL editor.

## 2) Backend env vars

Set these in `backend/.env` (or your backend runtime env):

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `INSTAGRAM_ACCESS_TOKEN`
- `INSTAGRAM_IG_USER_ID` (recommended; uses `graph.facebook.com/{version}/{ig_user_id}/media`)
- `INSTAGRAM_GRAPH_API_VERSION` (optional, default: `v19.0`)

## 3) Run a one-off sync

From the backend folder:

```bash
npx tsx src/cron/syncInstagramPosts.ts
```

Or after building:

```bash
npm run build
node dist/cron/syncInstagramPosts.js
```

## 4) Schedule every 6 hours

Example cron (runs at minute 0, every 6 hours):

```cron
0 */6 * * * cd /path/to/backend && npx tsx src/cron/syncInstagramPosts.ts
```

Use your hosting platform’s scheduler (Render cron, GitHub Actions, Railway cron, etc.) if you don’t have a system cron.

## 5) Frontend

Set these in your frontend env (already used elsewhere in the app):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

The feed UI is available at `/instagram` and uses the `instagram_posts` table.

