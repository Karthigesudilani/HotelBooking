#!/bin/bash

# Laravel startup script for Docker container
set -e

echo "Starting Laravel application..."

# Set default environment variables if not provided
export APP_NAME=${APP_NAME:-"HotelBooking"}
export APP_ENV=${APP_ENV:-"production"}
export APP_DEBUG=${APP_DEBUG:-"true"}
export APP_URL=${APP_URL:-"http://localhost"}

# Database configuration - default to MySQL
export DB_CONNECTION=${DB_CONNECTION:-"mysql"}
export DB_HOST=${DB_HOST:-"localhost"}
export DB_PORT=${DB_PORT:-"3306"}
export DB_DATABASE=${DB_DATABASE:-"hotelbooking"}
export DB_USERNAME=${DB_USERNAME:-"root"}
export DB_PASSWORD=${DB_PASSWORD:-""}

# Cache and session configuration
export CACHE_DRIVER=${CACHE_DRIVER:-"file"}
export SESSION_DRIVER=${SESSION_DRIVER:-"file"}
export SESSION_LIFETIME=${SESSION_LIFETIME:-"120"}
export QUEUE_CONNECTION=${QUEUE_CONNECTION:-"sync"}

# Logging configuration
export LOG_CHANNEL=${LOG_CHANNEL:-"stack"}
export LOG_LEVEL=${LOG_LEVEL:-"debug"}

echo "Environment configuration:"
echo "APP_ENV: $APP_ENV"
echo "DB_CONNECTION: $DB_CONNECTION"
echo "DB_HOST: $DB_HOST"
echo "DB_DATABASE: $DB_DATABASE"
echo "DB_USERNAME: $DB_USERNAME"

# Generate application key if not set
if [ -z "$APP_KEY" ]; then
    echo "Generating application key..."
    php artisan key:generate --force
fi

# Wait for database to be available (retry mechanism)
echo "Waiting for database connection..."
for i in {1..30}; do
    echo "Attempt $i/30: Testing database connection..."
    php artisan tinker --execute="DB::connection()->getPdo(); echo 'Database connection successful!';" && break
    if [ $i -eq 30 ]; then
        echo "Database connection failed after 30 attempts. Please check your database credentials."
        echo "Current database configuration:"
        echo "  Host: $DB_HOST"
        echo "  Port: $DB_PORT"
        echo "  Database: $DB_DATABASE"
        echo "  Username: $DB_USERNAME"
        echo "  Password: ${DB_PASSWORD:+[SET]}${DB_PASSWORD:-[NOT SET]}"
        echo ""
        echo "Common issues:"
        echo "  1. Check if DB_PASSWORD is set correctly"
        echo "  2. Verify database host and port"
        echo "  3. Ensure database exists"
        echo "  4. Check firewall/network connectivity"
        exit 1
    fi
    echo "Connection failed, retrying in 2 seconds..."
    sleep 2
done

# Run database migrations
echo "Running database migrations..."
php artisan migrate --force

# Clear and cache configuration
echo "Optimizing Laravel for production..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Set proper permissions
chown -R www-data:www-data /var/www/html/storage
chown -R www-data:www-data /var/www/html/bootstrap/cache
chmod -R 755 /var/www/html/storage
chmod -R 755 /var/www/html/bootstrap/cache

echo "Laravel optimization complete. Starting Apache..."

# Start Apache
exec apache2-foreground
