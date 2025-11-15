#!/bin/sh
# Docker entrypoint script for Raízes Digitais development container

set -e

echo "Raizes Digitais - Starting container..."

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL..."
until nc -z postgres 5432 2>/dev/null; do
  sleep 1
done
echo "PostgreSQL is ready!"

# Wait for Redis to be ready
echo "Waiting for Redis..."
until nc -z redis 6379 2>/dev/null; do
  sleep 1
done
echo "Redis is ready!"

# Navigate to backend and setup Laravel
cd /var/www/backend

# Generate app key if not exists
if [ ! -f .env ]; then
    echo "Creating .env file from .env.docker..."
    if [ -f .env.docker ]; then
        cp .env.docker .env
    elif [ -f .env.example ]; then
        cp .env.example .env
    else
        echo "No .env template found, creating minimal .env"
        cat > .env << EOF
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

REDIS_CLIENT=predis
REDIS_HOST=redis
REDIS_PORT=6379

SESSION_DRIVER=database
CACHE_STORE=redis
QUEUE_CONNECTION=redis
EOF
    fi
fi

# Fix database configuration if using localhost
if grep -q "DB_HOST=127.0.0.1" .env 2>/dev/null || grep -q "DB_HOST=localhost" .env 2>/dev/null; then
    echo "Fixing database host configuration..."
    sed -i 's/DB_HOST=127.0.0.1/DB_HOST=postgres/g' .env
    sed -i 's/DB_HOST=localhost/DB_HOST=postgres/g' .env
    sed -i 's/DB_USERNAME=root/DB_USERNAME=raizes/g' .env
    sed -i 's/DB_PASSWORD=$/DB_PASSWORD=secret/g' .env
fi

# Fix Redis configuration if using localhost
if grep -q "REDIS_HOST=127.0.0.1" .env 2>/dev/null || grep -q "REDIS_HOST=localhost" .env 2>/dev/null; then
    echo "Fixing Redis host configuration..."
    sed -i 's/REDIS_HOST=127.0.0.1/REDIS_HOST=redis/g' .env
    sed -i 's/REDIS_HOST=localhost/REDIS_HOST=redis/g' .env
    sed -i 's/REDIS_CLIENT=phpredis/REDIS_CLIENT=predis/g' .env
fi

if grep -q "APP_KEY=$" .env 2>/dev/null || ! grep -q "APP_KEY=" .env 2>/dev/null; then
    echo "Generating application key..."
    php artisan key:generate --ansi 2>/dev/null || true
fi

# Set proper permissions
echo "Setting permissions..."
chown -R www-data:www-data storage bootstrap/cache 2>/dev/null || true
chmod -R 775 storage bootstrap/cache 2>/dev/null || true

# Run migrations if AUTO_MIGRATE is set
if [ "$AUTO_MIGRATE" = "true" ]; then
    echo "Running database migrations..."
    php artisan migrate --force --no-interaction 2>/dev/null || echo "Migration skipped (run manually if needed)"
fi

# Run Composer scripts now that artisan exists
echo "Running Composer scripts..."
composer run-script post-autoload-dump || true

# Cache configuration for production
if [ "$APP_ENV" = "production" ]; then
    echo "Optimizing for production..."
    php artisan config:cache 2>/dev/null || true
    php artisan route:cache 2>/dev/null || true
    php artisan view:cache 2>/dev/null || true
fi

# Go back to root
cd /var/www

echo "Container ready!"

# Execute the main command (php-fpm or custom command)
exec "$@"
