ARG PHP_VERSION=8.3
FROM php:${PHP_VERSION}-fpm-alpine

# Install system deps
RUN apk add --no-cache \
    git curl libpng-dev libjpeg-turbo-dev zip unzip \
    oniguruma-dev postgresql-dev autoconf g++ make

# PHP extensions
RUN docker-php-ext-configure gd --with-jpeg \
    && docker-php-ext-install -j$(nproc) pdo_pgsql pgsql gd bcmath exif pcntl

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
WORKDIR /var/www/backend
COPY backend/composer.* ./
RUN composer install --no-scripts --no-autoloader
COPY backend ./
RUN composer dump-autoload --optimize

# Permissions
RUN chown -R www-data:www-data storage bootstrap/cache

CMD ["php-fpm"]