# Raízes Digitais – Monorepo (Next.js + Laravel)

## Stack
- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind + React-Query
- **Backend**: Laravel 10 + PHP 8.2 + PostgreSQL 15 + Redis + JWT
- **Monorepo**: Turborepo
- **Dev env**: Docker-Compose (Nginx, PHP-FPM, PostgreSQL, Redis)

## Scripts
```bash
npm install                # install root + workspace deps
npm run dev                # start both apps in parallel
npm run build              # production build
npm run lint               # lint all files
npm run format             # format all files
npm run test               # run tests