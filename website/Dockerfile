FROM php:8.4-fpm

WORKDIR /var/www/html

RUN apt-get update && apt-get install -y \
    zip unzip git curl nginx \
    libzip-dev libpng-dev libonig-dev libxml2-dev \
    default-mysql-client \
    && docker-php-ext-install pdo pdo_mysql zip mbstring \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

COPY composer.json composer.lock ./

COPY . .

RUN composer install --no-dev --optimize-autoloader --no-interaction

COPY package.json package-lock.json ./

RUN npm ci && npm run build

COPY docker/nginx.conf /etc/nginx/sites-available/default
COPY docker/start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 80

CMD ["/start.sh"]