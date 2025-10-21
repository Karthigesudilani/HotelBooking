# HotelBooking Backend

A robust Laravel API backend for hotel room booking system with JWT authentication, comprehensive booking management, and modern API design.

## 🚀 Tech Stack

- **Laravel 11** - PHP Framework
- **JWT Authentication** - Secure token-based auth
- **SQLite Database** - Lightweight database
- **Eloquent ORM** - Database abstraction
- **CORS Support** - Cross-origin requests
- **API Resources** - Structured API responses

## 📁 Project Structure

```
app/
├── Http/
│   └── Controllers/
│       ├── AuthController.php      # Authentication logic
│       ├── BookingController.php   # Booking management
│       ├── RoomController.php      # Room operations
│       ├── UserController.php      # User management
│       └── ContactController.php   # Contact form handling
├── Models/
│   ├── User.php                    # User model
│   ├── Room.php                    # Room model
│   └── Booking.php                 # Booking model
└── Providers/
    └── AppServiceProvider.php      # Service configuration

database/
├── migrations/                     # Database migrations
│   ├── create_users_table.php
│   ├── create_rooms_table.php
│   ├── create_bookings_table.php
│   └── ...
├── seeders/                        # Database seeders
│   ├── DatabaseSeeder.php
│   └── RoomSeeder.php
└── database.sqlite                 # SQLite database file

routes/
└── api.php                        # API routes definition

config/
├── jwt.php                        # JWT configuration
├── cors.php                       # CORS settings
└── database.php                   # Database configuration
```

## 🎯 Features

### Authentication & Authorization
- JWT token-based authentication
- User registration and login
- Password hashing and validation
- Protected API endpoints
- Token refresh mechanism

### Room Management
- Room CRUD operations
- Room search and filtering
- Availability checking
- Room details and pricing
- Image handling

### Booking System
- Create new bookings
- View user bookings
- Cancel bookings
- Booking validation
- Guest information handling

### API Features
- RESTful API design
- Comprehensive error handling
- Input validation
- CORS support
- Rate limiting
- API documentation

## 🛣️ API Endpoints

### Authentication
```
POST   /api/register              # User registration
POST   /api/login                 # User login
POST   /api/logout                # User logout
GET    /api/user                  # Get user profile
```

### Rooms
```
GET    /api/rooms                 # Get all rooms
GET    /api/rooms/search          # Search rooms
GET    /api/rooms/{id}            # Get specific room
```

### Bookings
```
GET    /api/bookings              # Get user bookings
POST   /api/bookings              # Create new booking
GET    /api/bookings/{id}         # Get specific booking
PUT    /api/bookings/{id}         # Update booking
DELETE /api/bookings/{id}         # Cancel booking
```

### Contact
```
POST   /api/contact               # Submit contact form
```

## 🗄️ Database Schema

### Users Table
- `id` - Primary key
- `name` - User full name
- `email` - Unique email address
- `email_verified_at` - Email verification timestamp
- `password` - Hashed password
- `created_at` / `updated_at` - Timestamps

### Rooms Table
- `id` - Primary key
- `room_name` - Room name/title
- `room_number` - Room number
- `description` - Room description
- `price_per_night` - Nightly rate
- `max_occupancy` - Maximum guests
- `amenities` - Room amenities (JSON)
- `created_at` / `updated_at` - Timestamps

### Bookings Table
- `id` - Primary key
- `user_email` - Guest email
- `guest_name` - Guest full name
- `guest_phone` - Guest phone number
- `room_id` - Foreign key to rooms
- `check_in` - Check-in date
- `check_out` - Check-out date
- `number_of_guests` - Guest count
- `total_fee` - Total booking cost
- `status` - Booking status (confirmed, cancelled, pending)
- `created_at` / `updated_at` - Timestamps

## 🚀 Getting Started

### Prerequisites
- PHP 8.1 or higher
- Composer
- SQLite (or MySQL/PostgreSQL)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd HotelBooking-BE

# Install dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure JWT secret
php artisan jwt:secret

# Run database migrations
php artisan migrate

# Seed the database
php artisan db:seed

# Start the development server
php artisan serve
```

The API will be available at `http://localhost:8000`

### Environment Configuration

Update your `.env` file:

```env
APP_NAME=HotelBooking
APP_ENV=local
APP_KEY=base64:your-app-key
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=sqlite
DB_DATABASE=/path/to/database.sqlite

JWT_SECRET=your-jwt-secret
JWT_TTL=60
JWT_REFRESH_TTL=20160
```

## 🔧 Configuration

### JWT Configuration
JWT tokens are configured in `config/jwt.php`:
- Token TTL: 60 minutes
- Refresh TTL: 2 weeks
- Algorithm: HS256

### CORS Configuration
CORS is configured in `config/cors.php`:
- Allowed origins: Frontend URL
- Allowed methods: GET, POST, PUT, DELETE
- Allowed headers: Content-Type, Authorization

### Database Configuration
- Default: SQLite for development
- Production: MySQL/PostgreSQL recommended
- Migrations included for all tables

## 🧪 Testing

```bash
# Run tests
php artisan test

# Run specific test suite
php artisan test --testsuite=Feature
php artisan test --testsuite=Unit
```

## 📊 API Usage Examples

### User Registration
```bash
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }'
```

### User Login
```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Search Rooms
```bash
curl -X GET "http://localhost:8000/api/rooms/search?destination=New York&check_in=2024-01-15&check_out=2024-01-17&number_of_guests=2" \
  -H "Authorization: Bearer your-jwt-token"
```

### Create Booking
```bash
curl -X POST http://localhost:8000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-jwt-token" \
  -d '{
    "room_id": 1,
    "check_in": "2024-01-15",
    "check_out": "2024-01-17",
    "number_of_guests": 2,
    "guest_name": "John Doe",
    "guest_email": "john@example.com",
    "guest_phone": "+1234567890"
  }'
```

## 🔒 Security Features

- JWT token authentication
- Password hashing (bcrypt)
- Input validation and sanitization
- CORS protection
- SQL injection prevention
- XSS protection
- Rate limiting
- CSRF protection

## 📈 Performance

- Database query optimization
- Eloquent relationships
- API response caching
- Efficient pagination
- Lazy loading relationships

## 🚀 Deployment

### Production Setup

```bash
# Install production dependencies
composer install --optimize-autoloader --no-dev

# Cache configuration
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run migrations
php artisan migrate --force
```

### Environment Variables (Production)
```env
APP_ENV=production
APP_DEBUG=false
DB_CONNECTION=mysql
DB_HOST=your-db-host
DB_DATABASE=your-db-name
DB_USERNAME=your-db-user
DB_PASSWORD=your-db-password
```

## 📝 API Documentation

### Response Format
All API responses follow a consistent format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Format
```json
{
  "success": false,
  "message": "Error message",
  "errors": {
    "field": ["Validation error message"]
  }
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the Laravel documentation
- Review the API examples

---

Built with ❤️ using Laravel and modern PHP practices.