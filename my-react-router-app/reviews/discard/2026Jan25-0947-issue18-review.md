# レビュー結果: Issue #18

## レビュー対象
- Issue: #18
- ブランチ: issue-18
- 比較対象: main ブランチ
- レビュー日時: 2026-01-25 09:47

## 全体所感
- Playwright導入と最小のクリティカルパス検証に絞れており、Issueの方針に沿っています。
- ただし、E2Eの実行環境とデータ初期化の整合が取れておらず、再現性に影響する懸念があります。

## 指摘事項（修正必須）
- [ ] E2E実行時のDB初期化が実際のデータソースに適用されない
  - 該当ファイル: playwright.config.ts:15
  - 該当ファイル: tests/e2e/global-setup.ts:6
  - 該当箇所: `webServer.command` が `npm run dev`、`global-setup` が `npm run db:reset`
  - 理由: `npm run dev` はSQLite (`db/local.sqlite`) を使用する一方、`db:reset` はD1(local)をリセットします。Issueの「E2E用のテストデータ初期化」が実際のデータに反映されず、テストが非決定的になり得ます。
  - 修正提案: E2E用に `npm run dev:local` へ統一してD1を使う、もしくは `db:reset` をSQLite向けの初期化に変更して整合を取る。

- [ ] E2E実行手順のドキュメントが実装設定と不一致
  - 該当ファイル: README.md:43
  - 該当ファイル: playwright.config.ts:11
  - 該当箇所: READMEは `dev:local` と記載、設定は `dev` かつ `baseURL` が `5177`
  - 理由: READMEの記載通りに進めるとポートや実行コマンドが一致せず、Issueの「実行方法と前提を共有」に反します。
  - 修正提案: READMEと `playwright.config.ts` の実行コマンド・ポートを一致させる。

## 改善提案（任意）
- [ ] HTMLレポートの提供方法の整理
  - 期待される効果: レポート閲覧方法の混乱を防ぎ、運用手順を簡潔にできる。
  - 実装の方向性（概要レベル）: `playwright.config.ts` のHTMLレポータ設定（host/port）と `npm run test:e2e-report` のポートをどちらかに統一、または不要な設定を削除する。

## 質問・確認事項
- E2EはSQLite運用を前提にする想定でしょうか、それともD1(local)を前提にする想定でしょうか？（`dev` / `dev:local` の選択と `db:reset` の整合のため）
- (回答)D1を前提としてます。

## 良い点
- Playwrightの導入と設定が最小限で、Issueの「クリティカルパスに限定」に沿った構成です。
- セレクタが `role` / `label` ベースで、安定したアクセシブルな指定になっています。
