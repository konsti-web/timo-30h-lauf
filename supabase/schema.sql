-- Schema für „Timo läuft 30h" – im Supabase SQL-Editor ausführen.
-- Danach VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY in .env eintragen (siehe README).

create table if not exists participants (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 1 and 60),
  instagram text check (instagram is null or char_length(instagram) <= 40),
  goal_laps int check (goal_laps is null or goal_laps between 1 and 500),
  created_at timestamptz not null default now()
);

create table if not exists laps (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid not null references participants(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists laps_participant_idx on laps (participant_id, created_at);

-- Offenes Community-Event auf Ehrlichkeitsbasis: jeder darf lesen und eintragen.
alter table participants enable row level security;
alter table laps enable row level security;

create policy "read participants" on participants for select using (true);
create policy "insert participants" on participants for insert with check (true);
create policy "read laps" on laps for select using (true);
create policy "insert laps" on laps for insert with check (true);
create policy "delete laps (Undo)" on laps for delete using (true);

-- Realtime für Live-Leaderboard aktivieren
alter publication supabase_realtime add table participants;
alter publication supabase_realtime add table laps;
