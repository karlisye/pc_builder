FROM php:8.4-fpm-alpine

RUN apk add --no-cache \
    nginx \
    curl \
    libpng-dev \
    libzip-dev \
    oniguruma-dev \
    && docker-php-ext-install pdo_mysql mbstring zip gd

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

COPY . .

RUN mkdir -p \
    /var/www/bootstrap/cache \
    /var/www/storage/framework/cache/data \
    /var/www/storage/framework/sessions \
    /var/www/storage/framework/views \
    /var/www/storage/logs \
    && chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache \
    && chmod -R 775 /var/www/storage /var/www/bootstrap/cache

RUN composer install --no-dev --optimize-autoloader --no-interaction

RUN printf 'user www-data;\n\
worker_processes auto;\n\
events { worker_connections 1024; }\n\
http {\n\
    include /etc/nginx/mime.types;\n\
    default_type application/octet-stream;\n\
    server {\n\
        listen 8000;\n\
        root /var/www/public;\n\
        index index.php;\n\
        location / { try_files $uri $uri/ /index.php?$query_string; }\n\
        location ~ \\.php$ {\n\
            fastcgi_pass 127.0.0.1:9000;\n\
            fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;\n\
            include fastcgi_params;\n\
        }\n\
    }\n\
}\n' > /etc/nginx/nginx.conf

EXPOSE 8000

CMD php-fpm -D && nginx -g "daemon off;"
