# 柔道整復師国家試験関係法規学習アプリ

A spaced-repetition learning app for judo therapy students preparing for Japan's national licensing examination (関係法規).

**Project Status:** Phase 1 MVP - Core learning features active
**Technology Stack:** Next.js 15 + NextAuth.js v5 + Prisma ORM + Aurora Serverless v2
**Hosting:** AWS Amplify SSR
**Users:** ~50 柔道整復師養成校 students
**Content:** 393 exam questions across 10 legal categories

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 12+ (or Aurora Serverless v2)
- Google Workspace account (for OAuth)

### Setup

1. **Clone and install**
```bash
git clone <repo>
cd app
npm ci
```

2. **Configure environment variables**
   - Copy `.env.example` to `.env.local`
   - Get Google OAuth credentials from [Google Cloud Console](https://console.cloud.google.com/)
   - For `NEXTAUTH_SECRET`, generate with: `openssl rand -base64 32`

```bash
# .env.local
DATABASE_URL="postgresql://user:password@host:5432/kokushi?schema=public"
NEXTAUTH_URL="http://localhost:3000"
AUTH_SECRET="<generated-secret>"
GOOGLE_CLIENT_ID="<your-client-id>"
GOOGLE_CLIENT_SECRET="<your-client-secret>"
```

3. **Database setup**
```bash
# Create/migrate database
npx prisma migrate dev --name init

# Seed initial 393 questions (from CSV)
npx prisma db seed
```

4. **Run locally**
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

## Available Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start Next.js dev server (hot reload) |
| `npm run build` | Build for production |
| `npm start` | Run production build |
| `npm run lint` | Run ESLint |
| `npx prisma studio` | Open Prisma Studio (web UI for DB) |
| `npx prisma migrate dev` | Run pending migrations |
| `npx prisma db seed` | Seed questions from CSV |

## Environment Variables

See [docs/ENVIRONMENT.md](docs/ENVIRONMENT.md) for detailed variable reference.

Quick reference:
- `DATABASE_URL` — Aurora connection string with `?schema=public`
- `NEXTAUTH_URL` — App URL (http://localhost:3000 dev, https://domain.amplifyapp.com prod)
- `AUTH_SECRET` — Session encryption (min 32 bytes, base64)
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — OAuth credentials

## Architecture

See [docs/02_ARCHITECTURE.md](docs/02_ARCHITECTURE.md) for full technical details.

**Core Stack:**
- **Frontend:** Next.js 15 (App Router), React 19, Tailwind CSS
- **Auth:** NextAuth.js v5 + Google OAuth (Workspace domain-restricted)
- **Database:** Aurora Serverless v2 (PostgreSQL) with Prisma ORM
- **Hosting:** AWS Amplify with automatic Git-based deployments
- **Offline:** Serwist PWA for static asset caching

**Core Features:**
- Student dashboard with daily goals
- Spaced repetition (SM-2 algorithm)
- Teacher admin panel for question management
- Leaderboard by course
- Practice tests (10 questions, category-based)
- Real-time answer feedback

## Deployment

See [docs/RUNBOOK.md](docs/RUNBOOK.md) for AWS Amplify SSR deployment procedures.

**Current Status:**
- Dev: Works locally
- Prod: AWS Amplify SSR (auto-deploy from git)

**Pre-deployment Checklist:**
1. [ ] All environment variables configured in Amplify Console
2. [ ] Database migrations run successfully (`npx prisma migrate deploy`)
3. [ ] `npm run build` succeeds locally
4. [ ] All tests pass (`npm test`)

## Project Structure

```
app/
├── src/
│   ├── app/                  # Next.js App Router pages & layouts
│   │   ├── (auth)/          # Protected routes
│   │   ├── api/              # API endpoints & server actions
│   │   └── page.tsx          # Landing page
│   ├── components/           # React components
│   ├── lib/                  # Utilities (auth, db, algorithms)
│   └── generated/
│       └── prisma/          # @prisma/client (auto-generated)
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── seed.ts               # Database seed script
├── docs/                     # Project documentation
│   ├── 01_PRD.md            # Product requirements
│   ├── 02_ARCHITECTURE.md   # Technical architecture
│   ├── 03_LEARNING_DESIGN.md # Learning design (SM-2)
│   ├── 06_DATABASE_SCHEMA.md # Database design
│   ├── ENVIRONMENT.md        # Environment variables guide
│   └── RUNBOOK.md           # Deployment procedures
├── amplify.yml              # AWS Amplify SSR config
├── next.config.ts           # Next.js configuration
├── prisma.config.ts         # Prisma client location
└── package.json             # Dependencies & scripts
```

## Key Features & Implementation

### 1. Spaced Repetition (SM-2 Algorithm)
- All questions use SM-2 for optimal retention
- Intervals: 1, 3, 7, 14, 30+ days
- Quality-based difficulty adjustment
- See [docs/03_LEARNING_DESIGN.md](docs/03_LEARNING_DESIGN.md)

### 2. Authentication (NextAuth.js v5)
- Google OAuth (Workspace domain-restricted)
- Role-based access: `student` | `teacher`
- Session stored in PostgreSQL (Prisma adapter)
- Middleware enforces `/app` route protection

### 3. Teacher Dashboard
- View all student learning records
- See daily question delivery schedule
- Manage question unlocks by date
- Export learning analytics

### 4. Daily Leaderboard
- Ranked by questions answered (day/week/all-time)
- Nickname display (real name never shown)
- Filtered by course (year group)

### 5. Practice Tests
- 10-question timed tests
- Category-based sampling
- Pass/fail at 70%+ threshold
- Results stored for teacher analytics

## Database Schema

See [docs/06_DATABASE_SCHEMA.md](docs/06_DATABASE_SCHEMA.md) for details.

**Core Models:**
- `User` — Student/teacher profile
- `Question` — 393 exam questions (unlocked by date)
- `LearningRecord` — SM-2 tracking per student per question
- `AnswerHistory` — All answer attempts with timestamps
- `PracticeTest` — Timed practice test records
- NextAuth tables: `Account`, `Session`, `VerificationToken`

## Cost Optimization

**Current Monthly Cost:** ~$15 (4-6月)

| Service | Est. Cost | Notes |
|---------|-----------|-------|
| Amplify Hosting | $10/mo | Static + SSR, 100GB bandwidth |
| Aurora Serverless v2 | $5/mo | Auto-pause when unused |
| Data Transfer | <$1 | 50 students, local WiFi heavy |

**AWS Free Credits:** $1000 (allocated for 2026)

See [docs/02_ARCHITECTURE.md](docs/02_ARCHITECTURE.md#コスト見通し) for cost breakdown with Phase 3 AI features.

## Testing

```bash
# Run all tests
npm test

# Watch mode
npm test -- --watch

# Coverage report
npm test -- --coverage
```

**Current Coverage:** 80%+ (unit + integration)
**Test Types:**
- Unit tests for utilities, SM-2 calculations, auth logic
- Integration tests for API routes, database operations
- E2E tests for critical user flows (login, answer question, leaderboard)

## Development

### Code Style
- TypeScript strict mode
- Immutable data patterns
- Server Actions for mutations (no REST API)
- Component size <400 LOC, function size <50 LOC

### Database Migrations
```bash
# Create migration after schema change
npx prisma migrate dev --name <description>

# Push to production (auto-runs before build in Amplify)
npx prisma migrate deploy
```

### Adding Questions
1. Place CSV in `scripts/`
2. Run `npx prisma db seed`
3. Verify in Prisma Studio: `npx prisma studio`

## Troubleshooting

### Common Issues

**Q: "PrismaClient is not configured"**
- Run: `npx prisma generate`
- Add `prisma.config.ts` with: `export const prismaConfigPath = "./src/generated/prisma";`

**Q: "DATABASE_URL parse error"**
- Aurora: Append `&uselibpqcompat=true` for libpq compatibility
- Amplify build includes this in `.env.production`

**Q: "SESSION_SECRET required"**
- Amplify console must have `AUTH_SECRET` variable set
- `NEXTAUTH_URL` must match domain (e.g., `https://app.amplifyapp.com`)

**Q: Database migrations fail on Amplify**
- Check Amplify build logs: Settings → Build logs
- Ensure `preBuild` runs `npx prisma migrate deploy`
- Verify database connection from build environment

## Documentation Index

- [01_PRD.md](docs/01_PRD.md) — Product requirements & timeline
- [02_ARCHITECTURE.md](docs/02_ARCHITECTURE.md) — Tech stack & design decisions
- [03_LEARNING_DESIGN.md](docs/03_LEARNING_DESIGN.md) — SM-2 algorithm details
- [04_SCHEDULE.md](docs/04_SCHEDULE.md) — Project timeline & phases
- [05_UX_DESIGN.md](docs/05_UX_DESIGN.md) — Wireframes & user flows
- [06_DATABASE_SCHEMA.md](docs/06_DATABASE_SCHEMA.md) — Entity relationships
- [ENVIRONMENT.md](docs/ENVIRONMENT.md) — Environment variable reference
- [RUNBOOK.md](docs/RUNBOOK.md) — Deployment & operations procedures
- [student-guide.md](docs/student-guide.md) — User guide for students

## Support & Contribution

**Issues:** GitHub Issues (tracked in project board)
**Questions:** keisuke@judo-study.jp
**Feedback:** Student & teacher feedback forms in app

## License

Private project for 関係法規学習アプリ
