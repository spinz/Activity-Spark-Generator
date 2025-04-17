# TODO: Transition to Subscription‑Based Product

This roadmap outlines the phases and tasks needed to evolve the static demo into a secure, subscription‑driven SaaS for YRDSB teachers.

## Phase 1: Planning & Architecture
- Define core user stories and acceptance criteria:
  - Teacher sign‑up, login, subscription purchase, idea generation, history view
- Choose tech stack:
  - Frontend (Next.js/React), backend (Node/Express or Next API routes)
  - Database (PostgreSQL via Prisma or MongoDB)
  - Auth (NextAuth.js or Auth0), Billing (Stripe)
- Design data models:
  - User, Subscription, UsageLog, CurriculumEntry
- Map out API endpoints and webhooks:
  - `/api/auth/*`, `/api/prompts/generate`, `/api/prompts/expand`, `/api/stripe/webhook`

## Phase 2: Project & Infrastructure Setup
- Initialize monorepo or single Next.js app
- Configure environment variables for secrets (`.env.local`)
- Install packages:
  - front: `next/react/react-dom`
  - back: `prisma/@prisma/client` or `mongoose`, `stripe`, `next-auth`
- Setup database schema and run migrations
- Seed minimal curriculum data for dev

## Phase 3: Authentication & Authorization
- Integrate NextAuth.js or Auth0:
  - Sign-up, login, JWT/session handling
- Protect API routes with auth middleware
- Create user profile page

## Phase 4: Subscription & Billing
- Configure Stripe Products & Prices
- Build pricing page in frontend
- Implement checkout session and success/cancel redirects
- Setup Stripe webhook endpoint to:
  - Activate/cancel subscriptions
  - Record events in database
- Enforce subscription status on generate endpoints

## Phase 5: AI Proxy & Service Layer
- Move LLM API key to server env
- Create server API for prompt generation:
  - `POST /api/generate` uses `buildPrompt()` logic
  - `POST /api/expand` for detailed guides
- Add request logging & cost tracking (record tokens and usage)
- Implement rate‑limiting or quotas per user/subscription tier

## Phase 6: Frontend Migration
- Convert `public/index.html` UI into React components:
  - `ConfigForm`, `InputForm`, `IdeasList`, `ExpandModal`  
- Implement client‑side calls to server API
- Display user state (logged in, subscription status)
- Add dashboard to view past ideas and usage

## Phase 7: Testing & Quality Assurance
- Write unit tests for API routes (Jest + supertest)
- Integration tests for auth and billing flows
- Mock LLM responses for deterministic tests
- End‑to‑end tests (Playwright or Cypress)

## Phase 8: Deployment & Monitoring
- Choose host (Vercel for Next.js or Heroku)
- Configure CI/CD pipeline
- Set production env variables (DB URL, Stripe keys, LLM key)
- Setup logging & error monitoring (Sentry, Datadog)
- Implement health checks and alerts

## Phase 9: Launch & Iteration
- Beta release to select teacher group
- Collect feedback and usage data
- Iterate on UX, add features:
  - Team accounts, classroom sharing
  - Export to PDF, lesson-plan templates
  - Admin dashboard for board analytics
- Plan marketing and documentation

---
