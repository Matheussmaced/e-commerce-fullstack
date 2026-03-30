# Etapa 1: Build do frontend React
FROM node:20-alpine AS frontend-build

WORKDIR /app

# Copia apenas os arquivos necessários para instalar dependências do React
COPY package*.json ./
COPY resources/js ./resources/js
COPY vite.config.js ./
COPY tsconfig.json ./
# Ajuste o caminho se seu React estiver em outra pasta

RUN npm install
RUN npm run build

# Etapa 2: Backend Laravel + frontend compilado
FROM php:8.2-fpm

WORKDIR /var/www/html

# Instala dependências do sistema para Laravel
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    libpng-dev \
    libonig-dev \
    curl \
    && docker-php-ext-install pdo_mysql mbstring zip exif pcntl bcmath gd

# Instala Composer
RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" \
    && php composer-setup.php --install-dir=/usr/local/bin --filename=composer

# Copia todos os arquivos do Laravel
COPY . .

# Instala dependências do Laravel
RUN composer install --no-dev --optimize-autoloader

# Copia frontend compilado para a pasta public do Laravel
COPY --from=frontend-build /app/dist ./public/dist

# Ajuste permissões para storage e bootstrap/cache
RUN chown -R www-data:www-data storage bootstrap/cache

EXPOSE 9000

CMD ["php-fpm"]
