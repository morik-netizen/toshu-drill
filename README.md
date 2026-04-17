# 徒手療法ドリル（Toshu Drill）

柔道整復師養成校の学生向け、徒手療法論の学習アプリ。

- 4択・○×形式の練習問題（SM-2アルゴリズムによる間隔反復学習）
- 講義ノートに写真をアップロード・整理
- 各回/全12回分の講義ノートを**PDFエクスポート**可能
- 模試機能、進捗ダッシュボード

**Tech:** Next.js 15 (App Router) + React 19 + Prisma 7 + NextAuth v5 + PostgreSQL (Aurora Serverless v2) + AWS S3
**Hosting:** AWS Amplify (SSR)
**PWA:** オフライン対応（Serwist）

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 12+（または Aurora Serverless v2）
- Google Cloud Console で作成した OAuth 2.0 クライアント
- AWS S3 バケット（写真保存用）

### Setup

1. Clone & install
   ```bash
   git clone https://github.com/morik-netizen/toshu-drill.git
   cd toshu-drill
   npm ci
   ```

2. 環境変数を設定
   ```bash
   cp .env.example .env.local
   # .env.local を編集:
   # - DATABASE_URL
   # - AUTH_SECRET (openssl rand -base64 32 で生成)
   # - AUTH_URL
   # - GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET
   # - S3_BUCKET_NAME / S3_REGION / S3_ACCESS_KEY_ID / S3_SECRET_ACCESS_KEY
   ```

3. DB 初期化
   ```bash
   npx prisma migrate dev --name init
   npx prisma db seed    # 問題データを投入（CSVは別途用意）
   ```

4. 起動
   ```bash
   npm run dev
   # http://localhost:3000
   ```

## Scripts

| コマンド | 内容 |
|---|---|
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | 本番ビルド |
| `npm start` | 本番サーバー起動 |
| `npm run lint` | ESLint |
| `npm test` | Jest 単体テスト |
| `npm run test:e2e` | Playwright E2E（ローカル） |
| `npm run test:e2e:prod` | Playwright E2E（本番URL） |
| `npx prisma studio` | DB GUI |
| `npx prisma migrate dev` | マイグレーション適用 |

## Features

### 学習
- 4択・○×問題、SM-2 アルゴリズムによる復習間隔最適化
- カテゴリ別進捗ダッシュボード
- 模試（10問ランダム、合格基準70%）
- 間違えた問題の復習機能

### 講義ノート
- 12 ユニット構成（徒手療法論全回分）
- 各セクションに写真アップロード（S3保存、presigned URL配信）
- ノートを PDF でエクスポート（単一ユニット / 全12回まとめ）
  - 学生情報（氏名・メール・出力日）を表紙に表示
  - 未登録スロットは「未登録」プレースホルダ

### 認証・認可
- NextAuth v5 + Google OAuth
- 所属ドメイン制限（`@oky.asahi.ac.jp` / `@asahi.ac.jp`）
- `student` / `teacher` ロール

## Architecture

- `src/app/` — Next.js App Router（pages, API routes）
- `src/components/` — React コンポーネント
- `src/lib/` — 認証、DB接続、S3、SM-2、採点等のロジック
- `src/lib/actions/` — Server Actions
- `src/lib/lecture-content.ts` — 講義ノート静的コンテンツ
- `prisma/schema.prisma` — DB スキーマ
- `e2e/` — Playwright E2E

詳細は [docs/02_ARCHITECTURE.md](docs/02_ARCHITECTURE.md) を参照。

## Environment Variables

詳細: [docs/ENVIRONMENT.md](docs/ENVIRONMENT.md)

最小構成:
```
DATABASE_URL        PostgreSQL 接続文字列
AUTH_SECRET         セッション署名鍵 (32 bytes base64)
AUTH_URL            アプリURL (https://...)
GOOGLE_CLIENT_ID    Google OAuth
GOOGLE_CLIENT_SECRET
S3_BUCKET_NAME      写真保存バケット
S3_REGION           e.g. ap-northeast-1
S3_ACCESS_KEY_ID
S3_SECRET_ACCESS_KEY
```

## Deployment

AWS Amplify の SSR コンピュートで運用中。`master` ブランチへ push すると自動デプロイ。

ビルド設定は [amplify.yml](amplify.yml) を参照。環境変数は Amplify Console で管理。

## Testing

- **Unit tests (Jest)**: 63件、カバレッジ 80%+
- **E2E (Playwright)**: ルーティングスモークテスト

```bash
npm test              # Jest
npm run test:e2e      # Playwright (local)
npm run test:e2e:prod # Playwright (production URL)
```

## Security Notes

- セッションは DB 管理（Prisma Adapter）
- 写真は S3 presigned URL で配信（期限 3600秒）
- アップロード時に `unitId` / `slotId` をパターン検証
- HTTPヘッダ: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`
- `dangerouslySetInnerHTML` は `LECTURE_UNITS` 静的定数のみに使用

## License

MIT License - see [LICENSE](LICENSE).

## Acknowledgments

本プロジェクトは朝日医療大学校の徒手療法論授業用に開発されました。国家試験問題データ（`refelence/*.csv`）は著作権の都合上リポジトリには含めていません。

