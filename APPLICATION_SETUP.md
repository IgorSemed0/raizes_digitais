# 🎯 Application Setup Guide - Raízes Digitais

## ✅ Issues Fixed

### 1. Laravel Database Connection
**Problem:** Laravel was trying to connect to `127.0.0.1:5432` instead of the Docker `postgres` container.

**Solution:** 
- Updated `backend/.env` to use `DB_HOST=postgres`
- Updated Redis configuration to use `REDIS_HOST=redis`
- Created `backend/.env.docker` template with correct Docker settings
- Updated entrypoint script to auto-fix configuration

### 2. Missing Sessions Table
**Problem:** Laravel session driver was set to `database` but the sessions table wasn't created.

**Solution:**
- The sessions table is included in the `0001_01_01_000000_create_users_table.php` migration
- Ran `php artisan migrate:fresh --force` to create all tables

### 3. Next.js Turbopack Crash
**Problem:** Next.js 16.0.1 has a known Turbopack bug causing crashes.

**Solution:**
- Added `dev:webpack` script as alternative: `"dev:webpack": "next dev -p 3000"`
- Users can choose between Turbopack (default) or Webpack (stable)

---

## 🚀 Quick Start

### First Time Setup

```bash
# 1. Start containers
docker compose up -d

# 2. Run the configuration fix script
./fix-config.sh

# 3. Run migrations (if not done by script)
docker compose exec app sh -c "cd backend && php artisan migrate:fresh --force"

# 4. Start development servers
docker compose exec app npm run dev
```

### If Already Set Up

```bash
# Start containers
docker compose up -d

# Start dev servers
docker compose exec app npm run dev
```

---

## 🔧 Configuration Files

### backend/.env (Auto-configured)

The entrypoint script automatically creates and fixes this file. Key settings:

```env
DB_HOST=postgres           # NOT 127.0.0.1 or localhost!
DB_PORT=5432
DB_DATABASE=raizes
DB_USERNAME=raizes
DB_PASSWORD=secret

REDIS_CLIENT=predis        # Use predis, not phpredis
REDIS_HOST=redis           # NOT 127.0.0.1 or localhost!
REDIS_PORT=6379

SESSION_DRIVER=database    # Sessions stored in database
CACHE_STORE=redis
QUEUE_CONNECTION=redis
```

### Manual Configuration (if needed)

If you need to manually fix the configuration:

```bash
# Copy the Docker template
cp backend/.env.docker backend/.env

# Or edit existing .env
docker compose exec app sh -c "cd backend && nano .env"

# Fix database host
sed -i 's/DB_HOST=127.0.0.1/DB_HOST=postgres/g' backend/.env
sed -i 's/REDIS_HOST=127.0.0.1/REDIS_HOST=redis/g' backend/.env

# Generate APP_KEY
docker compose exec app sh -c "cd backend && php artisan key:generate"

# Clear caches
docker compose exec app sh -c "cd backend && php artisan config:clear"
```

---

## 🌐 Access Points

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend (Next.js)** | http://localhost:3000 | React application |
| **Backend (Laravel)** | http://localhost:8000 | API endpoints |
| **Nginx Proxy** | http://localhost:8080 | Combined access |
| **PostgreSQL** | localhost:5433 | Database (external) |
| **Redis** | localhost:6379 | Cache/Queue |

---

## 🛠️ Development Commands

### Using Makefile (Recommended)

```bash
make dev              # Start development servers
make logs             # View logs
make shell            # Open container shell
make migrate          # Run migrations
make db-shell         # PostgreSQL shell
make clean            # Stop and clean
make help             # Show all commands
```

### Using Docker Compose

```bash
# Start dev servers
docker compose exec app npm run dev

# Run Laravel commands
docker compose exec app sh -c "cd backend && php artisan [command]"

# Run composer
docker compose exec app sh -c "cd backend && composer [command]"

# Run npm (root)
docker compose exec app npm [command]

# Run npm (frontend)
docker compose exec app sh -c "cd frontend && npm [command]"

# View logs
docker compose logs -f app

# Database shell
docker compose exec postgres psql -U raizes -d raizes

# Redis shell
docker compose exec redis redis-cli
```

---

## 🐛 Troubleshooting

### Laravel: Database Connection Refused

**Symptoms:**
```
SQLSTATE[08006] connection to server at "127.0.0.1", port 5432 failed
```

**Solution:**
```bash
# Run the fix script
./fix-config.sh

# Or manually fix
docker compose exec app sh -c "sed -i 's/DB_HOST=127.0.0.1/DB_HOST=postgres/g' backend/.env"
docker compose restart app
```

### Laravel: Sessions Table Not Found

**Symptoms:**
```
SQLSTATE[42P01]: Undefined table: 7 ERROR: relation "sessions" does not exist
```

**Solution:**
```bash
# Run migrations
docker compose exec app sh -c "cd backend && php artisan migrate:fresh --force"

# Check if table exists
docker compose exec postgres psql -U raizes -d raizes -c "\dt"
```

### Next.js: Turbopack Internal Error

**Symptoms:**
```
Error [TurbopackInternalError]: inner_of_uppers_lost_follower...
```

**Solution - Use Webpack instead:**
```bash
# Stop current dev server (Ctrl+C)

# Start with webpack
docker compose exec app sh -c "cd frontend && npm run dev:webpack"
```

### npm/node Not Found

**Symptoms:**
```
exec: "npm": executable file not found in $PATH
```

**Solution:**
```bash
# Clean and rebuild
make clean
make build-no-cache
make up
```

### Permission Denied on storage/logs

**Solution:**
```bash
make permissions
# or
docker compose exec -u root app chown -R www-data:www-data backend/storage backend/bootstrap/cache
```

---

## 📊 Database Management

### Run Migrations

```bash
# First time
docker compose exec app sh -c "cd backend && php artisan migrate --force"

# Fresh (drops all tables)
docker compose exec app sh -c "cd backend && php artisan migrate:fresh --force"

# With seeding
docker compose exec app sh -c "cd backend && php artisan migrate:fresh --seed --force"
```

### Database Shell

```bash
# PostgreSQL CLI
docker compose exec postgres psql -U raizes -d raizes

# Useful SQL commands
\dt              # List tables
\d sessions      # Describe sessions table
SELECT * FROM users LIMIT 5;
```

### Reset Database

```bash
# Stop containers and remove volume
docker compose down
docker volume rm raizes-digitais_pgdata

# Restart and migrate
docker compose up -d
docker compose exec app sh -c "cd backend && php artisan migrate:fresh --force"
```

---

## 🔄 Development Workflow

### Option 1: Everything in Docker (Recommended)

```bash
# Start all services
docker compose up -d

# Start dev servers in container
docker compose exec app npm run dev

# Access:
# - Frontend: http://localhost:3000 (hot reload works)
# - Backend:  http://localhost:8000 (hot reload works)
```

### Option 2: Hybrid (Database in Docker, App on Host)

```bash
# Start only database services
docker compose up -d postgres redis

# On host machine
cd frontend && npm run dev
cd backend && php artisan serve
```

### Option 3: Turbopack Issues? Use Webpack

```bash
docker compose exec app sh -c "cd frontend && npm run dev:webpack"
# or on host:
cd frontend && npm run dev:webpack
```

---

## 🧪 Testing the Setup

### 1. Verify Services

```bash
./verify-docker.sh
```

### 2. Test Laravel

```bash
# Test artisan
docker compose exec app sh -c "cd backend && php artisan --version"

# Test database connection
docker compose exec app sh -c "cd backend && php artisan migrate:status"

# Test route
curl http://localhost:8000
```

### 3. Test Frontend

```bash
# Should show Next.js dev server
curl http://localhost:3000
```

---

## 📦 Managing Dependencies

### Install New Package

```bash
# Frontend
docker compose exec app sh -c "cd frontend && npm install [package]"

# Backend (Composer)
docker compose exec app sh -c "cd backend && composer require [package]"

# Root (Turbo, etc.)
docker compose exec app npm install [package]
```

### Update Dependencies

```bash
# Update all
docker compose exec app npm update
docker compose exec app sh -c "cd backend && composer update"

# Or clean and reinstall
make clean-node-modules
make up
make install
```

---

## 🎬 Common Tasks

### Create New Laravel Migration

```bash
docker compose exec app sh -c "cd backend && php artisan make:migration create_posts_table"
```

### Create New Laravel Model

```bash
docker compose exec app sh -c "cd backend && php artisan make:model Post -m"
```

### Create New Laravel Controller

```bash
docker compose exec app sh -c "cd backend && php artisan make:controller PostController --resource"
```

### Clear Laravel Caches

```bash
docker compose exec app sh -c "cd backend && php artisan cache:clear"
docker compose exec app sh -c "cd backend && php artisan config:clear"
docker compose exec app sh -c "cd backend && php artisan route:clear"
docker compose exec app sh -c "cd backend && php artisan view:clear"
```

### Build Frontend for Production

```bash
docker compose exec app sh -c "cd frontend && npm run build"
```

---

## 📝 Environment Variables

### Laravel (.env)

```env
APP_NAME="Raízes Digitais"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8080

# Database - MUST use Docker service names
DB_CONNECTION=pgsql
DB_HOST=postgres          # ⚠️ NOT 127.0.0.1
DB_PORT=5432
DB_DATABASE=raizes
DB_USERNAME=raizes
DB_PASSWORD=secret

# Redis - MUST use Docker service name
REDIS_CLIENT=predis       # ⚠️ Use predis, not phpredis
REDIS_HOST=redis          # ⚠️ NOT 127.0.0.1
REDIS_PORT=6379

# Session
SESSION_DRIVER=database   # ⚠️ Requires sessions table
CACHE_STORE=redis
QUEUE_CONNECTION=redis
```

### Next.js (.env.local - if needed)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

---

## 🚦 Status Check

### Are Services Running?

```bash
docker compose ps
```

### Check Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f app
docker compose logs -f postgres
```

### Check Database Connection

```bash
docker compose exec app sh -c "cd backend && php artisan tinker"
# In tinker:
DB::connection()->getPdo();
# Should not throw error
```

---

## 🎉 Success Checklist

- [ ] Containers are running (`docker compose ps`)
- [ ] PostgreSQL is accessible (`docker compose exec postgres pg_isready`)
- [ ] Redis is responding (`docker compose exec redis redis-cli ping`)
- [ ] Laravel .env configured with `DB_HOST=postgres`
- [ ] APP_KEY is generated in .env
- [ ] Migrations ran successfully
- [ ] Sessions table exists
- [ ] Laravel responds on http://localhost:8000
- [ ] Next.js responds on http://localhost:3000
- [ ] Development servers start without errors

---

## 📚 Additional Resources

- **Docker Setup**: See `DOCKER_QUICKSTART.md`
- **Comprehensive Guide**: See `docker/README.md`
- **Fix Summary**: See `DOCKER_FIXES_SUMMARY.md`
- **All Commands**: Run `make help`
- **Verify Setup**: Run `./verify-docker.sh`
- **Fix Config**: Run `./fix-config.sh`

---

## 🆘 Getting Help

```bash
# Show all Make commands
make help

# Verify everything is working
./verify-docker.sh

# Fix configuration issues
./fix-config.sh

# View all logs
docker compose logs -f

# Open shell to debug
docker compose exec app sh
```

---

## ✨ You're Ready!

Everything is configured and working! Start developing:

```bash
# Start development servers
docker compose exec app npm run dev

# Or if Turbopack crashes:
docker compose exec app sh -c "cd frontend && npm run dev:webpack"
```

**Access your application:**
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- Proxy: http://localhost:8080

Happy coding! 🚀