ARG PHP_VERSION=8.3
FROM php:${PHP_VERSION}-fpm-alpine

RUN apk add --no-cache \
    git curl libpng-dev libjpeg-turbo-dev zip unzip \
    oniguruma-dev postgresql-dev autoconf g++ make \
    nodejs npm

RUN docker-php-ext-configure gd --with-jpeg \
    && docker-php-ext-install -j$(nproc) pdo_pgsql pgsql gd bcmath exif pcntl

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
RUN npm install -g turbo

WORKDIR /var/www
COPY package.json turbo.json .npmrc* ./
COPY backend/composer.* backend/
COPY frontend/package.json frontend/

RUN npm install --include=dev
RUN cd backend && composer install --no-dev --optimize-autoloader

COPY . .
RUN npm install --package-lock-only

RUN chown -R www-data:www-data backend/storage backend/bootstrap/cache

EXPOSE 8000 3000
CMD ["php-fpm"]
