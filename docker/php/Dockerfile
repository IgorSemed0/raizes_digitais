ARG PHP_VERSION=8.3
FROM php:${PHP_VERSION}-fpm-alpine

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
    npm

# --- PHP Extensions ---
RUN docker-php-ext-configure gd --with-jpeg \
    && docker-php-ext-install -j$(nproc) pdo_pgsql pgsql gd bcmath exif pcntl

# --- Composer ---
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# --- Global npm packages ---
RUN npm install -g turbo

# --- Working directory: entire monorepo ---
WORKDIR /var/www

COPY package.json turbo.json .npmrc* ./
COPY backend/composer.* backend/
COPY frontend/package.json frontend/
COPY packages/*/package.json packages/*/

# --- Install root + workspace deps ---
RUN npm ci --include=dev

# --- Install Laravel deps ---
RUN cd backend && composer install --no-dev --optimize-autoloader

COPY . .

# --- Permissions ---
RUN chown -R www-data:www-data \
    backend/storage \
    backend/bootstrap/cache

# --- Expose ports for dev servers ---
EXPOSE 8000 3000

# --- Start PHP-FPM ---
CMD ["php-fpm"]