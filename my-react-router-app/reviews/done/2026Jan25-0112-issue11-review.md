# レビュー結果: Issue #11

## レビュー対象
- Issue: #11
- ブランチ: issue-11
- 比較対象: main ブランチ
- レビュー日時: 2026-01-25 01:12

## 全体所感
- D1/SQLiteのリポジトリ抽象化とAPI/テスト追加はIssueの意図に沿っており、構成もシンプルで良いです。
- 一方で、ローカルシードの実行経路がマイグレーション未適用のDBを前提としておらず、READMEの手順とも矛盾しているため再現性に問題があります。

## 指摘事項（修正必須）
- [ ] ローカルシードがマイグレーション未適用のDBに対してINSERTを行う
  - 該当ファイル: db/seed.ts
  - 該当箇所: db/seed.ts:33
  - 理由: 新規DBでは `todos` テーブルが存在せず、`tsx db/seed.ts` 実行時に失敗します。READMEの「applies migrations + inserts」記述とも不整合です。
  - 修正提案: `seedLocalDatabase` の前に `db/migrations` を適用する（例: `db/seed.ts` 内で `readdirSync` + `db.exec` を実行、または `db/migrate.ts` を呼び出す）。もしくはREADME/スクリプト側を「先にdb:migrateが必要」に修正する。

## 改善提案（任意）
- [ ] 405レスポンスに `Allow` ヘッダーを付与する
  - 期待される効果: クライアントやデバッグ時に対応メソッドが明確になる
  - 実装の方向性（概要レベル）: `methodNotAllowed` で `headers: { Allow: "GET, POST" }` 等を返却（`app/routes/api.todos.ts`, `app/routes/api.todos.$id.ts`）。

## 質問・確認事項
- `npm run dev` が `wrangler dev` に変更されているためローカルでも `env.DB` が常に存在し、アプリ実行時はD1経由になります。Issueの「ローカルはSQLite」という意図は、D1ローカル運用で問題ない認識でしょうか？（`package.json:9`, `app/lib/todos.server.ts:159`）
- (回答)実装中にWranglerの機能でローカルもエミュレートするように変更したので問題ありません。

## 良い点
- D1/SQLite双方で同一のCRUD APIを提供するリポジトリ抽象が明快です（`app/lib/todos.server.ts`）。
- APIの入力検証とHTTPステータスの扱いが一貫しており、ベースラインとして十分です（`app/routes/api.todos.ts`, `app/routes/api.todos.$id.ts`）。
- ローカルSQLiteを使ったユニットテストでCRUD/API/loaderが検証されている点は良い回帰防止になります（`tests/unit/todos.test.ts`）。
