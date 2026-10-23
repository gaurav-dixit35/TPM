# Sajag

**Every patient. Every day. Nothing dropped.** A frontend-only care relay prototype for Sahyadri Care Centre.

## Run locally

- `npm install`
- `npm run dev`
- `npm run build`
- `npm test`

Deploy on Vercel by importing the repository. Framework: Vite; build: `npm run build`; output: `dist`. `vercel.json` rewrites deep links to the SPA and configures security headers. No environment variables are required.

## Product concept

Sajag makes the daily care handoff visible: admission → nurse temperature → doctor visit → verdict → bed release. The interactive Dashboard summarizes occupancy, daily coverage, role queues, fever flags, seven-day activity, and clearly caveated demo outcomes. Role queues answer “what is waiting on me?” The demo sign-in lets reviewers choose a stakeholder view; the role switcher is a preview control, not authentication. Data is fictional and stored in this browser only.

## V1 roles

Nurse records daily temperatures; Doctor reviews readings, records visits and recommends a discharge; Front Desk manages bed assignment and processes discharge; Centre Lead sees operational/outcome data read-only; System derives queues and streaks.

## Important prototype limits

Fever threshold and streak interpretation are illustrative and require clinical approval. Mortality shown from closed demo cases is not a facility quality measure. Do not use for patient care or real identifiable data. Production requires authentication, server authorization, durable shared records, audit controls, backup, and approved clinical definitions.

## Documentation

See [docs index](docs/OVERVIEW.md), [users](docs/USERS_AND_FEATURES.md), [rules](docs/BUSINESS_RULES.md), [prototype guide](docs/PROTOTYPE_GUIDE.md), [sprint plan](docs/SPRINT_PLAN.md), [architecture](docs/ARCHITECTURE.md), [design](docs/DESIGN_SYSTEM.md), [stack](docs/TECH_STACK_WHY.md), [testing](docs/TESTING.md), [deployment](docs/DEPLOYMENT.md), [roadmap](docs/ROADMAP.md), [assumptions](docs/ASSUMPTIONS_AND_OPEN_QUESTIONS.md).
