# Use PHP 8.2 with Apache
FROM php:8.2-apache

# Set working directory
WORKDIR /var/www/html

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev \
    nodejs \
    npm \
    sqlite3 \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy composer files first for better caching
COPY composer.json composer.lock ./

# Install PHP dependencies without scripts first
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-scripts

# Copy package.json for Node.js dependencies
COPY package.json ./

# Copy application code
COPY . .

# Set proper permissions for artisan and other files
RUN chmod +x artisan \
    && chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache

# Create .env file if it doesn't exist (needed for artisan commands)
RUN if [ ! -f .env ]; then \
        echo "APP_NAME=Laravel" > .env && \
        echo "APP_ENV=production" >> .env && \
        echo "APP_KEY=" >> .env && \
        echo "APP_DEBUG=false" >> .env && \
        echo "APP_URL=http://localhost" >> .env && \
        echo "DB_CONNECTION=sqlite" >> .env && \
        echo "DB_DATABASE=/var/www/html/database/database.sqlite" >> .env && \
        echo "CACHE_DRIVER=file" >> .env && \
        echo "SESSION_DRIVER=file" >> .env && \
        echo "QUEUE_CONNECTION=sync" >> .env; \
    fi

# Ensure database directory exists and create SQLite database
RUN mkdir -p /var/www/html/database \
    && touch /var/www/html/database/database.sqlite \
    && chown www-data:www-data /var/www/html/database/database.sqlite \
    && php -m | grep -i sqlite

# Run composer scripts now that artisan exists and has proper permissions
RUN composer run-script post-autoload-dump

# Install Node.js dependencies (including dev dependencies for build)
RUN npm install

# Configure Apache
RUN a2enmod rewrite
RUN echo '<VirtualHost *:80>\n\
    ServerAdmin webmaster@localhost\n\
    DocumentRoot /var/www/html/public\n\
    \n\
    <Directory /var/www/html/public>\n\
        AllowOverride All\n\
        Require all granted\n\
    </Directory>\n\
    \n\
    ErrorLog ${APACHE_LOG_DIR}/error.log\n\
    CustomLog ${APACHE_LOG_DIR}/access.log combined\n\
</VirtualHost>' > /etc/apache2/sites-available/000-default.conf

# Build frontend assets
RUN npm run build

# Generate application key and run migrations
RUN php artisan key:generate --force \
    && php artisan migrate --force \
    && php artisan config:cache \
    && php artisan route:cache \
    && php artisan view:cache

# Clean up dev dependencies and npm cache to reduce image size
RUN npm prune --production \
    && npm cache clean --force \
    && rm -rf /root/.npm

# Expose port 80
EXPOSE 80

# Start Apache
CMD ["apache2-foreground"]