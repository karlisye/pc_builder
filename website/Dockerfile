FROM php:8.4

WORKDIR /var/www/html

RUN apt-get update && apt-get install -y \
    zip unzip git curl \
    libzip-dev libpng-dev libonig-dev libxml2-dev \
    default-mysql-client \
    && docker-php-ext-install pdo pdo_mysql zip mbstring \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

COPY composer.json composer.lock ./

COPY . .

RUN composer install --no-dev --optimize-autoloader --no-interaction

EXPOSE 9000

CMD ["php-fpm"]