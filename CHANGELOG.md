# Changelog

## [Unreleased] - 2026-04-20

### Added
- **講義ノートPDFエクスポート機能**: 学生が各ユニット/全12回分の講義ノート（HTMLコンテンツ+写真）を PDF で保存できる機能 (`/lectures/print?unit=U01` / `?all=true`)
- `/lectures` ページに「年度末にデータが削除されます」警告バナーと「全12回分をPDFで保存」ボタン
- 各ユニット詳細ページに「この回をPDFで保存」ボタン
- **Playwright E2E テスト環境**: `e2e/print.spec.ts` に7件のルーティングスモークテスト
- `npm run test:e2e` / `npm run test:e2e:prod` スクリプト
- `LICENSE` ファイル (MIT License)

### Changed
- `README.md` を現プロジェクト（徒手療法ドリル）の実態に刷新
- `next.config.ts` にセキュリティ HTTP ヘッダ追加 (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy)
- `amplify.yml`: preBuild で `.env.production` をクリアしてから書き直す方式に変更（ビルドキャッシュ対策）
- `package.json` に `description` / `license` / `repository` フィールド追加
- `docs/RUNBOOK.md` に運用上の注意点を追記（Amplify env 2層構造、Aurora TLS、DB ユーザー独立性）
- `scripts/set-teacher.ts`: 対象メールアドレスを CLI 引数（または `TEACHER_EMAIL`）から受け取るように変更
- `prisma/seed.ts`: `sslmode=no-verify` への強制置換を削除、本番誤実行ガード `ALLOW_PROD_SEED` 追加
- `src/app/api/photos/upload/route.ts`: `slotId` にパターン検証を追加
- `src/lib/actions/progress.ts`: 認証処理を `redirect('/login')` + `isAllowedEmail` に統一

### Fixed
- `/api/photos/upload` の `slotId` 未検証問題（パストラバーサル懸念）
- `@hono/node-server` / `@prisma/dev` の脆弱性 (npm audit 19件→3件、dev依存のみ)
- DB 認証の間欠的 TLS エラー（Aurora TLS証明書を `sslmode=no-verify` で回避）

### Security
- **Google OAuth Client Secret** をローテーション (新: `****Sqdx`)
- **RDS master user password** をローテーション（最終: シンプルな英数字パスワード、その後 per-DB ユーザーに移行）
- **AUTH_SECRET** を再生成 (32 bytes base64)
- **DB ユーザーを独立化**: `kokushi_admin`（共有マスター）から `toshu_drill_user` / `kokushi_user` へ分離。パスワードローテーションが姉妹アプリ (`kokushi-houki-master`) に影響しなくなった
- `.env.google` / `.env.toshu` など不要な秘密情報ファイルを削除
- `refelence/関係法規...csv`（国家試験問題データ）を `.gitignore` 追加 + git untrack
- 古い OAuth Client Secret (`****y4_d`) を Google Console で無効化・削除
- **GitHub リポジトリを public 化**: https://github.com/morik-netizen/toshu-drill

### Infrastructure
- Aurora RDS **Data API 有効化** (VPC 外から SQL 実行可能に)
- `kokushi-cluster` 上で新規ユーザー `toshu_drill_user` / `kokushi_user` を作成、各 DB に独立権限付与
- Amplify App `darvc02yagg0e` (toshu-drill) の env を App-level のみに統一
- `NODE_TLS_REJECT_UNAUTHORIZED=0` / `NEXTAUTH_URL` (重複) を Amplify env から削除

### Documentation
- `plan/2026-04-20_作業サマリー.md` 追加（本日の全作業記録）
- `docs/01_PRD.md` / `docs/RUNBOOK.md` のタイトル・記述を現プロジェクトに合わせて修正
- `docs/RUNBOOK.md` に「Operational Gotchas」セクション追加
