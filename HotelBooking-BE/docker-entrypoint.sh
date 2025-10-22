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

# Test database connection (no migrations - already run)
echo "Testing database connection..."
DB_CONNECTED=false
for i in {1..3}; do
    echo "Attempt $i/3: Testing database connection..."
    php artisan tinker --execute="DB::connection()->getPdo(); echo 'Database connection successful!';" && {
        DB_CONNECTED=true
        break
    }
    echo "Connection failed, retrying in 2 seconds..."
    sleep 2
done

if [ "$DB_CONNECTED" = false ]; then
    echo "⚠️  Database connection failed after 3 attempts."
    echo "Current database configuration:"
    echo "  Host: $DB_HOST"
    echo "  Port: $DB_PORT"
    echo "  Database: $DB_DATABASE"
    echo "  Username: $DB_USERNAME"
    echo "  Password: ${DB_PASSWORD:+[SET]}${DB_PASSWORD:-[NOT SET]}"
    echo ""
    echo "⚠️  Application will start without database functionality."
    echo ""
    echo "To fix this issue:"
    echo "  1. Check if DB_PASSWORD is set correctly"
    echo "  2. Verify database host and port"
    echo "  3. Ensure database exists"
    echo "  4. Check firewall/network connectivity"
else
    echo "✅ Database connection successful!"
    echo "ℹ️  Skipping migrations - database tables already exist"
fi

# Clear and cache configuration (with fallback for database issues)
echo "Optimizing Laravel for production..."
if [ "$DB_CONNECTED" = true ]; then
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
else
    echo "⚠️  Skipping Laravel optimizations due to database connection failure."
    echo "⚠️  Application will run with basic configuration."
fi

# Set proper permissions
chown -R www-data:www-data /var/www/html/storage
chown -R www-data:www-data /var/www/html/bootstrap/cache
chmod -R 755 /var/www/html/storage
chmod -R 755 /var/www/html/bootstrap/cache

echo "Laravel optimization complete. Starting Apache..."

# Start Apache
exec apache2-foreground
