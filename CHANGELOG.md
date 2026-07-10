# Changelog

## [Unreleased] - 2026-07-10

### Added
- **模擬試験の間違い問題レビュー**: 結果画面に間違えた問題の一覧（問題文・自分の回答・正解・解説を選択肢本文つきで表示）。全問正解時はお祝いメッセージ。`MockTestReview` コンポーネント + 単体テスト4件
- **間違いノートから復習開始**: `/quiz?mode=mistakes` を追加し、間違いノート上部に「間違えた問題を復習する」ボタンを設置
- 模擬試験セッションに「中断する」リンク

### Changed
- **結果画面に問題文と選択肢本文を表示**（従来は正解/不正解と解説のみで文脈が消えていた）
- ホームのストリーク表記を「🔥 今週N日」に明確化
- 進捗ページのカテゴリ表記を「挑戦 N/M問」に明確化

### Fixed
- **ESLint設定破損**: eslint-config-next v15 は旧形式のため FlatCompat 経由の読み込みに修正（`npm run lint` が実行不能だった）
- **おすすめ問題数の不一致**: ホームの「おすすめN問」に対し学習画面が常に12問固定だった → `/quiz?count=` で推奨数を引き継ぎ（5〜30にクランプ）
- **redirect() の握りつぶし**: Server Component の try/catch が Next.js の制御フロー例外を握りつぶし、未ログイン時にログイン画面へ転送されなかった → `unstable_rethrow` で再スロー（ビルド時の "Mock test error" ノイズも解消）
- 未使用 import の除去（lint 警告解消）

### Operations
- mori.k@asahi.ac.jp に teacher ロールを付与（Aurora Data API 経由。`rds-db-credentials/.../kokushi_admin` のシークレットは資格情報が古く認証失敗するため、`.env` の資格情報から一時シークレットを作成して実行後に削除）

## [Released] - 2026-04-20

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
