# Docker Setup for Raízes Digitais

Este documento explica como configurar e usar o Docker para o projeto Raízes Digitais.

## Pré-requisitos

- Docker Engine 20.10+
- Docker Compose v2.0+

## Arquitetura

O projeto utiliza uma arquitetura de containers com os seguintes serviços:

- **app**: Container principal com PHP 8.3-FPM + Node.js (para o monorepo)
- **nginx**: Servidor web que faz proxy reverso para Laravel e Next.js
- **postgres**: Banco de dados PostgreSQL 15
- **redis**: Cache e sessões

## Estrutura de Arquivos

```
docker/
├── php/
│   ├── Dockerfile       # Imagem PHP com Node.js e dependências
│   └── php.ini         # Configurações customizadas do PHP
├── nginx/
│   └── default.conf    # Configuração do Nginx
└── README.md           # Este arquivo

docker-compose.yml      # Configuração principal
docker-compose.dev.yml  # Overrides para desenvolvimento
.dockerignore          # Arquivos excluídos do build
```

## Comandos Principais

### Desenvolvimento

```bash
# Build inicial
docker compose build app

# Iniciar todos os serviços
docker compose up -d

# Ver logs
docker compose logs -f app

# Parar todos os serviços
docker compose down

# Reconstruir após mudanças no Dockerfile
docker compose build --no-cache app
docker compose up -d --force-recreate app
```

### Executar Comandos nos Containers

```bash
# Laravel/PHP
docker compose exec app php artisan migrate
docker compose exec app composer install
docker compose exec app php artisan tinker

# Next.js/Frontend
docker compose exec app sh -c "cd frontend && npm run dev"
docker compose exec app sh -c "cd frontend && npm run build"

# Turbo (monorepo)
docker compose exec app npm run dev
docker compose exec app npm run build
docker compose exec app turbo run lint

# Bash interativo
docker compose exec app sh
```

### Banco de Dados

```bash
# Conectar ao PostgreSQL
docker compose exec postgres psql -U raizes -d raizes

# Executar migrations do Laravel
docker compose exec app php artisan migrate

# Seed do banco
docker compose exec app php artisan db:seed

# Reset completo
docker compose exec app php artisan migrate:fresh --seed
```

## Volumes Nomeados

Para evitar conflitos entre dependências do host e do container, usamos volumes nomeados:

- `node_modules`: Dependências npm do root
- `frontend_node_modules`: Dependências do Next.js
- `backend_node_modules`: Dependências do Laravel (se houver)
- `backend_vendor`: Dependências PHP do Composer
- `pgdata`: Dados do PostgreSQL

**Importante**: Isso significa que as pastas `node_modules` e `vendor` no container são diferentes das do host.

## Portas Expostas

- `8080`: Nginx (acesso ao app completo)
- `8000`: PHP Development Server (direto)
- `3000`: Next.js Development Server (direto)
- `5433`: PostgreSQL (para acesso externo)
- `6379`: Redis (para acesso externo)

## Acesso ao Aplicativo

- **Frontend (Next.js)**: http://localhost:8080 ou http://localhost:3000
- **Backend (Laravel API)**: http://localhost:8080/api ou http://localhost:8000
- **PostgreSQL**: `localhost:5433`
- **Redis**: `localhost:6379`

## Multi-Stage Builds

O Dockerfile possui dois stages:

### Development (padrão)
- Inclui todas as dev dependencies
- Instala dependências com `npm ci --include=dev`
- Não faz build do frontend
- Ideal para desenvolvimento local

### Production
- Apenas production dependencies
- Faz build otimizado do frontend
- Cache de rotas e views do Laravel
- Menor tamanho da imagem

Para usar o stage de produção:
```bash
docker compose -f docker-compose.yml build --build-arg TARGET=production
```

## Troubleshooting

### Erro: "npm: executable file not found"

Isso acontece quando os volumes do host sobrescrevem os arquivos do container. Solução:

```bash
# Limpar containers e volumes
docker compose down -v

# Rebuild
docker compose build --no-cache app

# Subir novamente
docker compose up -d
```

### Erro: "ENOENT: no such file or directory, scandir 'node_modules'"

Os `node_modules` estão em um volume nomeado. Para instalar/atualizar:

```bash
docker compose exec app npm install
# ou
docker compose exec app sh -c "cd frontend && npm install"
```

### Permissões negadas em storage/logs

```bash
docker compose exec app chown -R www-data:www-data backend/storage backend/bootstrap/cache
docker compose exec app chmod -R 775 backend/storage backend/bootstrap/cache
```

### Banco de dados não conecta

Verifique se o PostgreSQL está rodando:
```bash
docker compose ps postgres
docker compose logs postgres
```

Credenciais padrão:
- Host: `postgres` (dentro dos containers) ou `localhost` (fora)
- Port: `5432` (interno) ou `5433` (externo)
- Database: `raizes`
- User: `raizes`
- Password: `secret`

### Limpar tudo e recomeçar

```bash
# Para e remove tudo (containers, volumes, imagens)
docker compose down -v --rmi local

# Rebuild do zero
docker compose build --no-cache

# Subir
docker compose up -d
```

## Desenvolvimento Local vs Docker

Você pode escolher entre:

1. **Tudo no Docker**: Execute `npm run dev` dentro do container
2. **Híbrido**: Rode o banco/redis no Docker, mas Next.js e Laravel no host
3. **Docker para produção**: Use apenas para testar builds de produção

## Configuração de Ambiente

Crie um arquivo `.env` no backend com:

```env
APP_NAME="Raízes Digitais"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8080

DB_CONNECTION=pgsql
DB_HOST=postgres
DB_PORT=5432
DB_DATABASE=raizes
DB_USERNAME=raizes
DB_PASSWORD=secret

REDIS_HOST=redis
REDIS_PORT=6379

CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis
```

## Próximos Passos

- [ ] Adicionar Docker Compose para testes
- [ ] CI/CD com GitHub Actions
- [ ] Otimizar imagem de produção
- [ ] Adicionar healthchecks
- [ ] Configurar SSL/TLS para produção