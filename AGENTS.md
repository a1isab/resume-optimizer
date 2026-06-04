<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Resume Optimizer

## Commands
- `npm run dev` — dev server (localhost:3000)
- `npm run build` — production build
- `npm run lint` — ESLint v9 (flat config at `eslint.config.mjs`)
- No test framework is installed. Do not run `npm test`.

## Key conventions
- `@/` path alias maps to `src/`.
- All Supabase DB writes in API route handlers must use `createAdminClient()` (service role). Browser/server clients are read-only for DB.
- Zod schemas imported from `zod/v4`, not `zod`.
- Dark mode only: `<html className="dark">` is hardcoded in the root layout.
- shadcn/ui style is `base-nova` (not the default `new-york`).
- Tailwind v4 via `@tailwindcss/postcss` (no `tailwind.config` file).
- PDF parsing: dynamic `import("pdfjs-dist")` on the client side only.

## Env requirements (`.env.local`)
Required: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `GOOGLE_AI_API_KEY`. Stripe keys needed for billing features.

## Architecture
- `src/app/` — App Router pages and API route handlers
- `src/app/api/` — REST endpoints (analyze, stripe/*, user/*)
- `src/components/` — React components; shadcn/ui primitives in `components/ui/`
- `src/lib/` — shared logic (supabase/, ai/, stripe/, types, validations, constants)
- `supabase/schema.sql` — DB schema with RLS policies
- `middleware.ts` — refreshes Supabase session, redirects unauthenticated users on `PROTECTED_ROUTES` [/dashboard, /results, /account]
- `skills-lock.json` — records which agent skills are loaded
- `AGENTS.md` is referenced by `CLAUDE.md` via `@AGENTS.md`.
