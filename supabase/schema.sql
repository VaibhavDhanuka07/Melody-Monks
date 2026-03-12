create extension if not exists "pgcrypto";

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text unique not null,
  role text default 'student',
  created_at timestamptz default now()
);

create table if not exists courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  instrument text not null,
  description text,
  level text,
  price numeric,
  created_at timestamptz default now()
);

create table if not exists lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references courses(id) on delete cascade,
  title text not null,
  video_url text,
  pdf_notes text,
  created_at timestamptz default now()
);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references users(id) on delete cascade,
  course_id uuid references courses(id) on delete set null,
  date timestamptz not null,
  status text default 'pending'
);

create table if not exists practice_sessions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references users(id) on delete cascade,
  tool text,
  accuracy numeric,
  duration integer,
  created_at timestamptz default now()
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references users(id) on delete cascade,
  amount numeric,
  status text,
  method text,
  created_at timestamptz default now()
);

create index if not exists lessons_course_id_idx on lessons(course_id);
create index if not exists bookings_student_id_idx on bookings(student_id);
create index if not exists practice_sessions_student_id_idx on practice_sessions(student_id);
create index if not exists payments_student_id_idx on payments(student_id);
