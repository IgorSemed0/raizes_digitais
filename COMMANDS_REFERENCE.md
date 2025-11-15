# 🚀 Commands Reference - Raízes Digitais

Quick reference for all common commands.

## 📋 Prerequisites

Containers must be running:
```bash
docker compose up -d
```

---

## 🎯 Quick Commands (Makefile)

### Essential Commands

```bash
make init              # First-time setup (build + install + migrate)
make dev               # Start dev servers (both frontend + backend)
make logs              # View container logs
make shell             # Open shell in container
make help              # Show all available commands
```

### Development

```bash
make dev               # Start both servers (Turbo)
make dev-frontend      # Start only Next.js
make dev-backend       # Start only Laravel
make build-frontend    # Build Next.js for production
```

### Database

```bash
make migrate           # Run migrations
make migrate-fresh     # Drop all tables and migrate
make seed              # Seed the database
make fresh             # Fresh migrations + seeding
make db-shell          # Open PostgreSQL shell
make db-reset          # Reset database (removes all data)
```

### Laravel/PHP

```bash
make artisan CMD="..."       # Run artisan command
make composer CMD="..."      # Run composer command
make cache-clear             # Clear all Laravel caches
make optimize                # Optimize for production
make permissions             # Fix storage permissions
```

### NPM/JavaScript

```bash
make npm CMD="..."           # Run npm in root
make npm-frontend CMD="..."  # Run npm in frontend
make npm-backend CMD="..."   # Run npm in backend (if needed)
```

### Docker Management

```bash
make build             # Build Docker images
make build-no-cache    # Build without cache
make up                # Start containers
make down              # Stop containers
make restart           # Restart containers
make ps                # Show container status
make logs-all          # Show all container logs
```

### Testing & Quality

```bash
make test              # Run all tests
make test-backend      # Run Laravel tests
make test-frontend     # Run Next.js tests
make lint              # Run linters
make format            # Format code
```

### Cleanup

```bash
make clean             # Stop and remove containers
make clean-all         # Remove everything (containers, volumes, images)
make clean-node-modules    # Remove node_modules volumes
make clean-vendor          # Remove vendor volume
```

---

## 🐳 Docker Compose Commands

### Basic Operations

```bash
# Start all services
docker compose up -d

# Stop all services
docker compose down

# View logs
docker compose logs -f app
docker compose logs -f postgres
docker compose logs -f nginx

# Show running containers
docker compose ps

# Restart a service
docker compose restart app
```

### Execute Commands in Containers

```bash
# Laravel/Artisan
docker compose exec -T app sh -c "cd backend && php artisan migrate"
docker compose exec -T app sh -c "cd backend && php artisan make:model Post"

# Composer
docker compose exec -T app sh -c "cd backend && composer require package/name"
docker compose exec -T app sh -c "cd backend && composer update"

# NPM (root)
docker compose exec -T app npm install
docker compose exec -T app npm run dev

# NPM (frontend)
docker compose exec -T app sh -c "cd frontend && npm install axios"
docker compose exec -T app sh -c "cd frontend && npm run build"

# Interactive shell
docker compose exec app sh
docker compose exec app bash  # if bash is available
```

### Database Operations

```bash
# PostgreSQL shell
docker compose exec postgres psql -U raizes -d raizes

# Check PostgreSQL status
docker compose exec -T postgres pg_isready -U raizes

# Redis CLI
docker compose exec redis redis-cli

# Redis ping
docker compose exec -T redis redis-cli ping
```

---

## 📦 Common Tasks

### Install New Package

**Frontend:**
```bash
# Using make
make npm-frontend CMD="install axios"

# Using docker compose
docker compose exec -T app sh -c "cd frontend && npm install axios"
```

**Backend:**
```bash
# Using make
make composer CMD="require laravel/sanctum"

# Using docker compose
docker compose exec -T app sh -c "cd backend && composer require laravel/sanctum"
```

### Create Laravel Resources

```bash
# Controller
make artisan CMD="make:controller PostController --resource"

# Model with migration
make artisan CMD="make:model Post -m"

# Migration
make artisan CMD="make:migration create_posts_table"

# Seeder
make artisan CMD="make:seeder PostSeeder"

# Request
make artisan CMD="make:request StorePostRequest"
```

### Clear Laravel Caches

```bash
# Clear all
make cache-clear

# Individual caches
make artisan CMD="cache:clear"
make artisan CMD="config:clear"
make artisan CMD="route:clear"
make artisan CMD="view:clear"
```

### Build & Deploy

```bash
# Build frontend
make build-frontend

# Optimize backend
make optimize

# Or manually:
docker compose exec -T app sh -c "cd frontend && npm run build"
docker compose exec -T app sh -c "cd backend && php artisan config:cache"
docker compose exec -T app sh -c "cd backend && php artisan route:cache"
docker compose exec -T app sh -c "cd backend && php artisan view:cache"
```

---

## 🔧 Troubleshooting Commands

### Fix Configuration

```bash
# Run the fix script
./fix-config.sh

# Or manually fix .env
docker compose exec -T app sh -c "cd backend && sed -i 's/DB_HOST=127.0.0.1/DB_HOST=postgres/g' .env"
docker compose restart app
```

### Fix Permissions

```bash
# Using make
make permissions

# Manually
docker compose exec -u root app chown -R www-data:www-data backend/storage backend/bootstrap/cache
docker compose exec -u root app chmod -R 775 backend/storage backend/bootstrap/cache
```

### Reset Everything

```bash
# Clean rebuild
make clean-all
make build-no-cache
make up
make install
make migrate
```

### Check Status

```bash
# Verify Docker setup
./verify-docker.sh

# Test common commands
./test-common-commands.sh

# Check container status
docker compose ps

# Check logs for errors
docker compose logs -f app
```

---

## 🌐 Access Points

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | Next.js development server |
| Backend | http://localhost:8000 | Laravel development server |
| Nginx | http://localhost:8080 | Reverse proxy (combined) |
| PostgreSQL | localhost:5433 | Database (external access) |
| Redis | localhost:6379 | Cache/Queue |

---

## 💡 Tips

### Use Aliases

Add to your `~/.bashrc` or `~/.zshrc`:

```bash
alias dc='docker compose'
alias dce='docker compose exec -T app'
alias dcl='docker compose logs -f'
alias art='docker compose exec -T app sh -c "cd backend && php artisan"'
```

Then use:
```bash
dc up -d
art migrate
dcl app
```

### Turbopack Issues?

If Next.js crashes with Turbopack error:

```bash
# Use webpack instead
docker compose exec app sh -c "cd frontend && npm run dev:webpack"
```

### Speed Up Rebuilds

```bash
# Only rebuild what changed
docker compose build app

# Full clean rebuild (slower)
make build-no-cache
```

### Background vs Foreground

```bash
# Background (detached)
docker compose up -d

# Foreground (see logs immediately)
docker compose up

# Stop foreground: Ctrl+C
```

---

## 📚 Related Documentation

- **Quick Start**: `DOCKER_QUICKSTART.md`
- **Application Setup**: `APPLICATION_SETUP.md`
- **Fixes Applied**: `FIXES_APPLIED.md`
- **Full Docker Guide**: `docker/README.md`
- **Makefile Help**: Run `make help`

---

## 🆘 Quick Help

```bash
# Show all make commands
make help

# Verify everything works
./verify-docker.sh

# Test common commands
./test-common-commands.sh

# Fix configuration
./fix-config.sh

# View real-time logs
docker compose logs -f app
```

---

**Last Updated:** 2025-11-15  
**All commands tested and working** ✅