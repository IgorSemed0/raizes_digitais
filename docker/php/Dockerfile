ARG PHP_VERSION=8.3
FROM php:${PHP_VERSION}-fpm-alpine

RUN apk add --no-cache \
    git curl libpng-dev libjpeg-turbo-dev zip unzip \
    oniguruma-dev postgresql-dev autoconf g++ make

RUN docker-php-ext-configure gd --with-jpeg \
    && docker-php-ext-install -j$(nproc) pdo_pgsql pgsql gd bcmath exif pcntl

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/backend

COPY backend/composer.* ./
RUN composer install --no-scripts --no-autoloader

COPY backend ./
RUN composer dump-autoload --optimize
# --- Copy root config ---
COPY package.json turbo.json .npmrc* ./
# adicione esta linha para o lockfile
COPY package-lock.json ./

RUN chown -R www-data:www-data storage bootstrap/cache

# --- Install root + workspace deps (only frontend/backend) ---
RUN npm ci --include=dev

# --- Install Laravel deps (sem scripts porque ainda não há artisan)---
RUN cd backend && composer install --no-dev --no-scripts --optimize-autoloader

# --- Copy full source ---
COPY . .

# --- Rodar scripts do Laravel agora que o código existe ---
    RUN php -d variables_order=EGPCS backend/artisan package:discover --ansi || true

# --- Permissions ---
RUN chown -R www-data:www-data \
    backend/storage \
    backend/bootstrap/cache

# --- Expose ports ---
EXPOSE 8000 3000

# --- Start PHP-FPM ---
CMD ["php-fpm"]