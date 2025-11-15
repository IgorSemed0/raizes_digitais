#!/bin/bash
# Fix Laravel and Docker configuration
# This script fixes database connection issues and restarts services

set -e

echo "🔧 Raízes Digitais - Configuration Fix Script"
echo "=============================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if Docker is running
if ! docker compose ps >/dev/null 2>&1; then
    print_error "Docker Compose is not available or containers are not running"
    echo "Please run: docker compose up -d"
    exit 1
fi

print_info "Step 1: Stopping containers..."
docker compose down

print_success "Containers stopped"
echo ""

print_info "Step 2: Fixing backend/.env configuration..."

# Create proper .env from .env.docker
if [ -f backend/.env.docker ]; then
    cp backend/.env.docker backend/.env
    print_success "Created backend/.env from .env.docker template"
elif [ -f backend/.env ]; then
    print_warning "backend/.env exists, updating database configuration..."
    # Fix database host
    if grep -q "DB_HOST=127.0.0.1" backend/.env || grep -q "DB_HOST=localhost" backend/.env; then
        sed -i 's/DB_HOST=127.0.0.1/DB_HOST=postgres/g' backend/.env
        sed -i 's/DB_HOST=localhost/DB_HOST=postgres/g' backend/.env
        print_success "Fixed DB_HOST to use 'postgres' container"
    fi

    # Fix database credentials
    sed -i 's/DB_USERNAME=root/DB_USERNAME=raizes/g' backend/.env
    sed -i 's/DB_DATABASE=laravel/DB_DATABASE=raizes/g' backend/.env
    sed -i 's/^DB_PASSWORD=$/DB_PASSWORD=secret/g' backend/.env
    print_success "Updated database credentials"

    # Fix Redis host
    if grep -q "REDIS_HOST=127.0.0.1" backend/.env || grep -q "REDIS_HOST=localhost" backend/.env; then
        sed -i 's/REDIS_HOST=127.0.0.1/REDIS_HOST=redis/g' backend/.env
        sed -i 's/REDIS_HOST=localhost/REDIS_HOST=redis/g' backend/.env
        print_success "Fixed REDIS_HOST to use 'redis' container"
    fi

    # Fix Redis client
    sed -i 's/REDIS_CLIENT=phpredis/REDIS_CLIENT=predis/g' backend/.env

    # Set session driver to database
    if ! grep -q "SESSION_DRIVER" backend/.env; then
        echo "SESSION_DRIVER=database" >> backend/.env
    else
        sed -i 's/SESSION_DRIVER=.*/SESSION_DRIVER=database/g' backend/.env
    fi
    print_success "Configured session driver"
else
    print_warning "No backend/.env found, will be created by entrypoint"
fi

echo ""
print_info "Step 3: Starting containers..."
docker compose up -d

print_success "Containers started"
echo ""

print_info "Step 4: Waiting for services to be ready..."
sleep 5

# Wait for PostgreSQL
print_info "Waiting for PostgreSQL..."
for i in {1..30}; do
    if docker compose exec -T postgres pg_isready -U raizes >/dev/null 2>&1; then
        print_success "PostgreSQL is ready"
        break
    fi
    if [ $i -eq 30 ]; then
        print_error "PostgreSQL failed to start"
        exit 1
    fi
    sleep 1
done

# Wait for Redis
print_info "Waiting for Redis..."
for i in {1..30}; do
    if docker compose exec -T redis redis-cli ping 2>&1 | grep -q "PONG"; then
        print_success "Redis is ready"
        break
    fi
    if [ $i -eq 30 ]; then
        print_error "Redis failed to start"
        exit 1
    fi
    sleep 1
done

echo ""
print_info "Step 5: Configuring Laravel..."

# Generate APP_KEY if needed
if docker compose exec -T app sh -c "grep -q 'APP_KEY=$' backend/.env 2>/dev/null || ! grep -q 'APP_KEY=' backend/.env 2>/dev/null"; then
    print_info "Generating Laravel APP_KEY..."
    docker compose exec -T app php artisan key:generate --ansi
    print_success "APP_KEY generated"
fi

# Clear caches
print_info "Clearing Laravel caches..."
docker compose exec -T app php artisan config:clear >/dev/null 2>&1 || true
docker compose exec -T app php artisan cache:clear >/dev/null 2>&1 || true
docker compose exec -T app php artisan route:clear >/dev/null 2>&1 || true
docker compose exec -T app php artisan view:clear >/dev/null 2>&1 || true
print_success "Caches cleared"

echo ""
print_info "Step 6: Setting up database..."

# Check if we can connect to database
if docker compose exec -T app php artisan migrate:status >/dev/null 2>&1; then
    print_success "Database connection successful"

    # Ask to run migrations
    echo ""
    read -p "$(echo -e ${BLUE}Do you want to run migrations? [y/N]:${NC} )" -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "Running migrations..."
        docker compose exec -T app php artisan migrate --force
        print_success "Migrations completed"

        echo ""
        read -p "$(echo -e ${BLUE}Do you want to seed the database? [y/N]:${NC} )" -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            print_info "Seeding database..."
            docker compose exec -T app php artisan db:seed --force
            print_success "Database seeded"
        fi
    fi
else
    print_warning "Could not connect to database. Check configuration."
fi

echo ""
print_info "Step 7: Verifying configuration..."

# Show current .env database config
echo ""
echo -e "${BLUE}Current Database Configuration:${NC}"
docker compose exec -T app sh -c "grep -E '^(DB_HOST|DB_PORT|DB_DATABASE|DB_USERNAME|REDIS_HOST)' backend/.env" 2>/dev/null || true

echo ""
echo "=============================================="
echo -e "${GREEN}✨ Configuration fix completed!${NC}"
echo "=============================================="
echo ""
echo "Services Status:"
docker compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}" | head -5
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo "  1. Run development servers:"
echo -e "     ${GREEN}docker compose exec app npm run dev${NC}"
echo ""
echo "  2. Or use webpack instead of turbo (if Next.js crashes):"
echo -e "     ${GREEN}docker compose exec app sh -c 'cd frontend && npm run dev:webpack'${NC}"
echo ""
echo "  3. Access your application:"
echo "     • Frontend: http://localhost:3000"
echo "     • Backend:  http://localhost:8000"
echo "     • Nginx:    http://localhost:8080"
echo ""
echo "  4. View logs:"
echo -e "     ${GREEN}docker compose logs -f app${NC}"
echo ""
echo "  5. If Next.js still crashes with Turbopack error:"
echo "     This is a known Next.js 16 bug. Use webpack:"
echo -e "     ${YELLOW}cd frontend && npm run dev:webpack${NC}"
echo ""
