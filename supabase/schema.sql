-- 呼吸数記録テーブル
create table if not exists breathing_records (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  dog_name text not null,
  dog_breed text not null,
  birth_date date not null,
  weight numeric(5,2) not null check (weight > 0),
  gender text not null check (gender in ('オス', '去勢オス', 'メス', '避妊メス')),
  measured_date date not null,
  room_temperature numeric(4,1) not null,
  is_sleeping boolean not null default false,
  after_toilet boolean not null default false,
  is_other_condition boolean not null default false,
  other_condition_note text,
  breathing_rate integer not null check (breathing_rate >= 0),
  recorded_by text not null,
  notes text
);

create index if not exists breathing_records_dog_name_idx on breathing_records (dog_name);
create index if not exists breathing_records_measured_date_idx on breathing_records (measured_date);

-- RLS有効化
alter table breathing_records enable row level security;

-- スタッフ全員（ログイン不要・共通のanonキーで利用）が閲覧・登録・編集・削除できるようにする。
-- 社内スタッフのみが使う想定のため、管理者ログインは設けていない。
create policy "allow_anon_all" on breathing_records
  for all to anon using (true) with check (true);
