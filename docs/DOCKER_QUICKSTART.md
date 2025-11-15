meu-projeto-next/
├── src/                  # Código fonte full-stack (frontend + backend logic)
│   ├── app/              # Rotas e lógica full-stack (App Router)
│   │   ├── (auth)/       # Grupo de rotas para autenticação full-stack
│   │   │   ├── login/
│   │   │   │   ├── page.tsx          # Frontend: Form de login (Client Component)
│   │   │   │   ├── actions.ts        # Backend: Server Actions para processar login
│   │   │   │   ├── loading.tsx       # Frontend: Loading UI com Suspense
│   │   │   │   └── error.tsx         # Frontend/Backend: Error handling
│   │   │   ├── register/
│   │   │   │   ├── page.tsx          # Frontend: Form de registro
│   │   │   │   └── actions.ts        # Backend: Server Actions para criar usuário
│   │   │   ├── layout.tsx            # Frontend: Layout compartilhado
│   │   │   └── middleware.ts         # Backend: Middleware para proteção de rotas (verifica auth)
│   │   ├── api/          # Backend: Rotas API full-stack (Route Handlers)
│   │   │   ├── users/
│   │   │   │   ├── route.ts          # Backend: GET/POST/PUT/DELETE para usuários (integra DB)
│   │   │   │   └── schema.ts         # Backend: Validação de dados (ex: com Zod)
│   │   │   ├── products/
│   │   │   │   └── route.ts          # Backend: API para produtos (ex: e-commerce)
│   │   │   └── webhook/
│   │   │       └── route.ts          # Backend: Handler para webhooks (ex: Stripe pagamentos)
│   │   ├── dashboard/    # Rota protegida full-stack (ex: admin panel)
│   │   │   ├── [id]/                 # Backend/Frontend: Rota dinâmica com params
│   │   │   │   ├── page.tsx          # Frontend: UI com dados fetchados no servidor
│   │   │   │   ├── actions.ts        # Backend: Server Actions para updates
│   │   │   │   ├── not-found.tsx     # Frontend: 404 custom
│   │   │   │   └── global-error.tsx  # Frontend/Backend: Erro global
│   │   │   ├── _components/          # Frontend: Componentes locais (ex: DataTable)
│   │   │   ├── _lib/                 # Backend: Utils para fetching/DB queries
│   │   │   │   └── queries.ts        # Backend: Funções SQL/ORM para DB
│   │   │   ├── layout.tsx            # Frontend: Layout com sidebar
│   │   │   ├── template.tsx          # Frontend: Template re-renderizável
│   │   │   └── middleware.ts         # Backend: Middleware específico para dashboard
│   │   ├── blog/         # Exemplo híbrido: SSG para posts estáticos, SSR para dinâmicos
│   │   │   ├── [slug]/
│   │   │   │   ├── page.tsx          # Backend/Frontend: Fetch dados no servidor
│   │   │   │   └── generateStaticParams.ts # Backend: Para SSG dinâmico
│   │   │   └── revalidate.ts         # Backend: ISR (Incremental Static Regeneration)
│   │   ├── @analytics/   # Rota paralela: Analytics em paralelo com conteúdo principal
│   │   │   └── page.tsx              # Backend: Fetch métricas no servidor
│   │   ├── (.)modal/     # Rota interceptada: Modal full-stack (ex: confirmação de ação)
│   │   │   └── page.tsx              # Frontend: UI, Backend: Lógica via actions
│   │   ├── page.tsx      # Raiz: Página home (SSR por default)
│   │   ├── globals.css   # Frontend: Estilos globais
│   │   ├── i18n/         # Full-stack: Internacionalização (server-side locales)
│   │   │   └── config.ts             # Config para múltiplos idiomas
│   │   └── metadata.ts   # Backend: Metadata dinâmica para SEO (ex: baseado em DB)
│   ├── components/       # Frontend: Componentes reutilizáveis (Client/Server)
│   │   ├── AuthProvider.tsx          # Full-stack: Provider para autenticação (usa cookies/sessions)
│   │   ├── DataFetcher.tsx           # Backend: Server Component para fetching
│   │   └── ui/                       # Frontend: Componentes atômicos
│   │       └── FormInput.tsx
│   ├── lib/              # Backend: Lógica compartilhada full-stack
│   │   ├── db.ts                     # Backend: Conexão DB (ex: Prisma, Drizzle, MongoDB)
│   │   ├── auth.ts                   # Backend: Config autenticação (ex: NextAuth)
│   │   ├── cache.ts                  # Backend: Caching utils (ex: com Redis)
│   │   ├── utils.ts                  # Full-stack: Funções gerais (ex: validação)
│   │   └── schema/                   # Backend: Schemas para DB/API (ex: Zod ou Prisma schema)
│   │       └── user.ts
│   ├── hooks/            # Frontend: Hooks para client-side (ex: useSession)
│   │   └── useUser.ts
│   ├── types/            # Full-stack: Tipos compartilhados (ex: User, Product)
│   │   └── index.ts
│   ├── styles/           # Frontend: Estilos (Tailwind, CSS modules)
│   │   └── tailwind.css
│   ├── middleware.ts     # Backend: Middleware global (ex: logging, rate limiting)
│   └── public/           # Frontend: Ativos estáticos (otimizados)
│       ├── images/
│       │   └── logo.png
│       └── fonts/
│           └── myfont.woff
├── prisma/               # Backend: Para ORM como Prisma (schema e migrations)
│   └── schema.prisma                 # Definição de modelos DB
├── .env                  # Full-stack: Vars de ambiente (DB_URL, API_KEYS)
├── .env.local            # Local overrides
├── next.config.mjs       # Full-stack: Configs (ex: experimental serverActions, images)
├── package.json          # Dependências (ex: prisma, next-auth, zod)
├── tsconfig.json         # Full-stack: Config TS
├── eslint.config.mjs     # Linting
├── .gitignore
├── instrumentation.ts    # Backend: Monitoramento (OpenTelemetry para logs/metrics)
├── tailwind.config.js    # Frontend: Config Tailwind (se usado)
├── docker-compose.yml    # Full-stack: Para containerização (ex: com DB)
├── README.md
└── vercel.json           # Backend: Config deploy Vercel (ex: functions, redirects)