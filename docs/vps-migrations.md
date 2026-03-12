# VPS Migration Workflow (Supabase + Prisma)

Use this when your local network blocks `db.<project-ref>.supabase.co:5432`.

## 1) Create a VPS

Any Linux VPS works (Ubuntu 22.04 recommended). Make sure outbound port 5432 is allowed.

## 2) Install Node.js and Git

```bash
sudo apt update
sudo apt install -y git
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

## 3) Clone the repo

```bash
git clone https://github.com/VaibhavDhanuka07/Melody-Monks.git
cd Melody-Monks
npm install
```

## 4) Set Supabase direct DB connection

Create `backend/.env` with **direct** connection strings. Example:

```
DATABASE_URL="postgresql://postgres.<project-ref>:<PASSWORD>@db.<project-ref>.supabase.co:5432/postgres?sslmode=require"
DIRECT_URL="postgresql://postgres.<project-ref>:<PASSWORD>@db.<project-ref>.supabase.co:5432/postgres?sslmode=require"
```

Replace `<PASSWORD>` with your Supabase DB password and URL-encode special characters (e.g. `@` ? `%40`).

## 5) Run migrations (creates migration files + applies)

```bash
npm run prisma:migrate -- --name init
```

This creates `backend/prisma/migrations/*` and applies them to Supabase.

## 6) Commit and push migrations

```bash
git add backend/prisma/migrations backend/prisma/migration_lock.toml
git commit -m "chore: add initial prisma migrations"
git push origin main
```

## 7) Future deploys

Once migrations are in the repo, run this anywhere (CI/VPS):

```bash
npm run prisma:deploy
```
