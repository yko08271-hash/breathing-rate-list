-- 犬種「MIX（ミックス）」選択時に、何犬と何犬のミックスかを任意入力できるようにするマイグレーション
-- 既にbreathing_recordsテーブルを作成済みの場合は、SQL Editorでこれを実行してください。
alter table breathing_records
  add column if not exists mix_detail text;
