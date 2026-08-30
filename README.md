# autter-demo-nextjs-saas

A realistic broken SaaS-style Next.js dashboard for testing [Autter](https://autter.dev) code review workflows.

This repository is part of the Autter Sandbox set. It intentionally contains subtle bugs and risky implementation patterns that are common in AI-assisted product work: fragile auth state, missing webhook validation, tenant isolation gaps, concurrency issues, information disclosure, N+1 data loading, and validation drift.

Use it when you want to show a design partner how Autter reviews pull requests against a real-looking SaaS codebase instead of a toy example.

## What this app includes

- Next.js App Router with TypeScript
- Mock email/password session handling
- Organizations, projects, invites, usage tracking, and plan-limit-style behavior
- Billing webhook route
- Dashboard analytics-style page
- Vitest tests with expected-failure markers for planted bugs
- Challenge files with copy-paste AI editor prompts
- GitHub issue templates copied from the challenge files

## Quick start

```bash
git clone https://github.com/Autter-dev/autter-demo-nextjs-saas.git
cd autter-demo-nextjs-saas
npm install
npm test
npm run dev
```

Open the local app at `http://localhost:3000`.

To verify the production build:

```bash
npm run build
```

## Demo flow with Autter

1. Fork this repository or create a working branch.
2. Go to [autter.dev](https://autter.dev) and sign in.
3. Connect GitHub to Autter if it is not connected already.
4. Add this repository to the Autter installation or select it from the Autter dashboard.
5. Pick one challenge from the table below.
6. Open the matching file in `/challenges`.
7. Copy the "Suggested AI Editor Prompt" into Cursor, Claude Code, Copilot, Windsurf, or another AI code editor.
8. Let the editor make a small fix and add or update tests.
9. Push the branch and open a pull request.
10. Let Autter review the PR, then address the findings it raises.

The strongest demo path is to pick a security or tenant-isolation challenge first, because Autter should identify risks that a normal green test run might miss.

## How the sandbox is designed

This repo is intentionally imperfect. Do not fix every issue on `main`. Each challenge is meant to create a focused PR that Autter can review.

Some tests use expected-failure markers. They document known broken behavior while keeping the baseline suite runnable for demo setup. When solving a challenge, convert or replace the relevant expected-failure coverage with passing regression tests.

## Challenges

| Challenge                                                                                                                              | Difficulty | Category        | Expected Autter review angle                      |
| -------------------------------------------------------------------------------------------------------------------------------------- | ---------- | --------------- | ------------------------------------------------- |
| [Broken session handling after browser refresh](./challenges/broken-session-handling-after-browser-refresh.md)                         | Medium     | Auth            | fragile auth state handling                       |
| [Missing webhook signature verification](./challenges/missing-webhook-signature-verification.md)                                       | Medium     | Security        | security risk at an external trust boundary       |
| [Cross-org project access bug](./challenges/cross-org-project-access-bug.md)                                                           | High       | Authorization   | tenant isolation and authorization bypass         |
| [Usage counter race condition](./challenges/usage-counter-race-condition.md)                                                           | High       | Reliability     | data consistency and concurrency risk             |
| [API leaks stack traces](./challenges/api-leaks-stack-traces.md)                                                                       | Low        | Security        | information disclosure                            |
| [Invite acceptance missing expiry check](./challenges/invite-acceptance-missing-expiry-check.md)                                       | Medium     | Business logic  | broken business logic and missing edge-case tests |
| [Dashboard N+1 query pattern](./challenges/dashboard-n-1-query-pattern.md)                                                             | Medium     | Performance     | performance regression risk                       |
| [Generated validation logic is duplicated and inconsistent](./challenges/generated-validation-logic-is-duplicated-and-inconsistent.md) | Low        | Maintainability | maintainability risk and behavior drift           |

## Recommended PR description

```markdown
## What changed

- Fixed the selected challenge
- Added or updated regression coverage

## Why

- The previous implementation allowed the broken behavior described in `/challenges/...`

## Validation

- npm test
- npm run build

## Risks

- Note any behavior that Autter should review carefully
```

## Learn more

Visit [autter.dev](https://autter.dev) to learn more about Autter and connect this repository as a review demo.
