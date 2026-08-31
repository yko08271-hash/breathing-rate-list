-- 測定パターンに「その他」（任意メモ付き）を追加するマイグレーション
-- 既にbreathing_recordsテーブルを作成済みの場合は、SQL Editorでこれを実行してください。
alter table breathing_records
  add column if not exists is_other_condition boolean not null default false,
  add column if not exists other_condition_note text;
