# 呼吸数リスト セットアップ手順

## 技術スタック
- Next.js 15 (App Router)
- Supabase（DB。スタッフ全員が同じURLで入力・閲覧できます。ログイン機能は設けていません）
- Tailwind CSS

---

## 1. Supabase 設定

このプロジェクトは、請求書アプリ・オタク研究所トレーニング報告システムと同じSupabaseプロジェクト（`ntxljshugpmbjouolmrc`）を共有する前提でセットアップ済みです。新規プロジェクト作成は不要です。

1. 既存のSupabaseプロジェクトを開く
2. **SQL Editor** を開き `supabase/schema.sql` の内容を貼り付けて実行（`breathing_records` テーブルが追加されます。他のテーブルには影響しません）

別のSupabaseプロジェクトを使いたい場合は、新規プロジェクトを作成し、**Settings → API** から Project URL と anon public key を控えて、下記の環境変数に設定してください。

---

## 2. 環境変数設定

`.env.local` に既存プロジェクトのURL・anon keyを設定済みです（他のアプリと同じ値）。別プロジェクトを使う場合は編集してください：

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
```

---

## 3. ローカル開発

```bash
npm install
npm run dev
```

http://localhost:3000 を開く（Windowsでは `起動.bat` をダブルクリックでも起動できます）

---

## 4. Vercel デプロイ

1. https://vercel.com でアカウントにログイン（GitHubログイン推奨）
2. このフォルダを GitHub リポジトリにプッシュ
3. Vercel で「New Project」→ GitHub リポジトリを選択
4. **Environment Variables** に以下を設定：
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
   ```
5. Deploy を実行

デプロイ後に発行されるURLをスタッフ全員に共有すれば、誰でも入力・閲覧できます。

---

## 5. GitHub 管理

```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/YOUR_USERNAME/breathing-rate-list.git
git push -u origin main
```

---

## 機能一覧

### 記録フォーム（「記録する」タブ）
- 記録者名・犬名・犬種・年齢（生年月日）・体重・性別・測定日・温度（室温）・呼吸数（回/分）・睡眠中/トイレ後チェック・備考を登録
- 記録者名はブラウザに自動保存（次回から入力不要）
- 既に登録のある犬名を入力すると、犬種・生年月日・性別・体重を直近の記録から自動入力（毎回の入力の手間を軽減）

### 一覧・フィルター（「一覧・フィルター」タブ）
- 犬名・犬種・性別・年齢・体重・測定日・室温・呼吸数・睡眠中/トイレ後・記録者でフィルター
- 各記録を一覧表示（テーブル内から編集・削除も可能）
- フィルター結果の件数・平均呼吸数を表示

## 補足
- 社内スタッフのみが使う想定のため管理者ログインは設けていません。全員が同じURLで入力・閲覧・編集・削除できます。
- 誤って公開したくない場合は、Vercelの「Deployment Protection」機能や、URLを社内限定で共有する運用でご利用ください。
