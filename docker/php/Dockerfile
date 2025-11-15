# raizes-digitais/docker/php/Dockerfile
ARG PHP_VERSION=8.3
FROM php:${PHP_VERSION}-fpm-alpine AS base

# --- System Dependencies ---
RUN apk add --no-cache \
    git \
    curl \
    libpng-dev \
    libjpeg-turbo-dev \
    zip \
    unzip \
    oniguruma-dev \
    postgresql-dev \
    autoconf \
    g++ \
    make \
    nodejs \
    npm \
    netcat-openbsd

# --- PHP Extensions ---
RUN docker-php-ext-configure gd --with-jpeg \
    && docker-php-ext-install -j$(nproc) pdo_pgsql pgsql gd bcmath exif pcntl

# --- Composer ---
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# --- Global npm packages ---
RUN npm install -g turbo

# --- Working directory: entire monorepo ---
WORKDIR /var/www

# ============================================================
# DEVELOPMENT STAGE
# ============================================================
FROM base AS development

# --- Copy root config including package-lock.json ---
COPY package.json package-lock.json turbo.json ./

# --- Copy workspace package.json and lock files ---
COPY backend/composer.* backend/
COPY frontend/package*.json frontend/

# --- Install root + workspace deps (only frontend/backend) ---
RUN npm ci --include=dev --legacy-peer-deps || npm install --legacy-peer-deps

# --- Install Laravel deps (no-scripts since artisan doesn't exist yet) ---
RUN cd backend && composer install --optimize-autoloader --no-scripts

# --- Copy full source ---
COPY . .

# --- Run Composer scripts now that artisan exists ---
RUN cd backend && composer run-script post-autoload-dump || true

# --- Permissions ---
RUN chown -R www-data:www-data \
    backend/storage \
    backend/bootstrap/cache 2>/dev/null || true

# --- Copy entrypoint script ---
COPY docker/php/docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# --- Expose ports ---
EXPOSE 8000 3000 9000

# --- Set entrypoint ---
ENTRYPOINT ["docker-entrypoint.sh"]

# --- Start PHP-FPM ---
CMD ["php-fpm"]

# ============================================================
# PRODUCTION STAGE
# ============================================================
FROM base AS production

# Set production environment
ENV NODE_ENV=production \
    APP_ENV=production

# --- Copy root config including package-lock.json ---
COPY package.json package-lock.json turbo.json ./

# --- Copy workspace package.json and lock files ---
COPY backend/composer.* backend/
COPY frontend/package*.json frontend/

# --- Install root + workspace deps (production only) ---
RUN npm ci --omit=dev --legacy-peer-deps || npm install --omit=dev --legacy-peer-deps

# --- Install Laravel deps (production, no-scripts initially) ---
RUN cd backend && composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist --no-scripts

# --- Copy full source ---
COPY . .

# --- Run Composer scripts now that artisan exists ---
RUN cd backend && composer run-script post-autoload-dump || true

# --- Build frontend for production ---
RUN cd frontend && npm run build

# --- Build backend assets (if any) ---
RUN cd backend && php artisan config:cache && php artisan route:cache && php artisan view:cache 2>/dev/null || true

# --- Permissions ---
RUN chown -R www-data:www-data \
    backend/storage \
    backend/bootstrap/cache

# --- Copy entrypoint script ---
COPY docker/php/docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# --- Remove dev dependencies and cleanup ---
RUN rm -rf /root/.npm /root/.composer /tmp/*

# --- Expose port ---
EXPOSE 9000

# --- Set entrypoint ---
ENTRYPOINT ["docker-entrypoint.sh"]

# --- Start PHP-FPM ---
CMD ["php-fpm"]
