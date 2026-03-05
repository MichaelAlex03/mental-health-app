# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start Next.js dev server (http://localhost:3000)
- `npm run build` — production build
- `npm run lint` — ESLint (`eslint .`)

## Architecture

Next.js App Router project with Supabase auth and shadcn/ui components (new-york style).

### Supabase Auth

- **Server client**: `lib/supabase/server.ts` — always create a new client per request (required for Fluid compute)
- **Browser client**: `lib/supabase/client.ts`
- **Proxy/middleware**: `proxy.ts` + `lib/supabase/proxy.ts` — refreshes sessions via `getClaims()`, redirects unauthenticated users to `/auth/login`
- Env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

### Route Structure

- `/` — public landing page
- `/auth/*` — login, sign-up, forgot-password, update-password, confirmation
- `/protected/*` — authenticated-only pages (guarded by proxy middleware)

### UI

- shadcn/ui components in `components/ui/` (Radix primitives + Tailwind)
- Theme colors defined as CSS variables (`hsl(var(--...))`) in `app/globals.css`
- Dark mode via `next-themes` with class strategy
- Path aliases: `@/*` maps to project root
