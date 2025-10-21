# HotelBooking Frontend

A modern Vue.js 3 application for hotel room booking with a clean, responsive design and modular component architecture.

## 🚀 Tech Stack

- **Vue 3** (Composition API)
- **Vue Router 4** for routing
- **Vite** for fast development and building
- **Custom CSS** with modern design patterns
- **Responsive Design** for all screen sizes

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── BookingCard.vue      # Individual booking display
│   ├── BookingSummary.vue   # Search criteria summary
│   ├── CancelBookingModal.vue # Booking cancellation modal
│   ├── DashboardHeader.vue  # Dashboard header section
│   ├── EmptyState.vue       # Loading/error/empty states
│   ├── RoomCard.vue         # Individual room display
│   └── WelcomePanel.vue     # Welcome/benefits panel
├── pages/               # Main application pages
│   ├── Dashboard.vue        # User dashboard
│   ├── Login.vue            # User login
│   ├── Register.vue         # User registration
│   ├── RoomSearch.vue       # Room search form
│   ├── Rooms.vue            # Available rooms listing
│   ├── Contact.vue          # Contact information form
│   └── Confirmation.vue     # Booking confirmation
├── services/            # API services
│   └── api.js              # API communication layer
├── state/               # State management
│   └── auth.js            # Authentication state
├── utils/               # Utility functions
│   └── imageUtils.js       # Image handling utilities
└── router/              # Route configuration
    └── index.js           # Router setup
```

## 🎯 Features

### Authentication
- User registration with password validation
- Secure login with JWT tokens
- Protected routes and session management
- Password strength indicator

### Room Booking
- Advanced room search with filters
- Real-time room availability
- Detailed room information and pricing
- Booking confirmation flow

### User Dashboard
- View upcoming and past bookings
- Cancel bookings with confirmation
- Booking history and details
- Responsive booking cards

### UI/UX Features
- Modern, clean design
- Responsive layout for all devices
- Loading states and error handling
- Smooth animations and transitions
- Accessible components

## 🛣️ Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | RoomSearch | Room search form |
| `/rooms` | Rooms | Available rooms listing |
| `/contact` | Contact | Contact information form |
| `/confirmation` | Confirmation | Booking confirmation |
| `/login` | Login | User login |
| `/register` | Register | User registration |
| `/dashboard` | Dashboard | User dashboard (protected) |

## 🧩 Components

### Core Components

#### BookingCard
- Displays individual booking information
- Shows room details, dates, and pricing
- Handles booking cancellation
- Responsive design with hover effects

#### RoomCard
- Displays individual room information
- Shows pricing and availability
- Book now functionality
- Image optimization

#### EmptyState
- Handles loading, error, and empty states
- Consistent UI across different scenarios
- Retry and action buttons
- Customizable messages

#### WelcomePanel
- Reusable welcome/benefits panel
- Customizable content and styling
- Used in registration and other pages
- Responsive design

### Modal Components

#### CancelBookingModal
- Confirmation modal for booking cancellation
- Shows booking summary
- Prevents accidental cancellations
- Accessible design

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd HotelBooking-FE

# Install dependencies
npm install

# Start development server
npm run dev
```

The development server will start at `http://localhost:5173`

### Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=HotelBooking
```

### API Integration
The application communicates with the Laravel backend through the `api.js` service:

- Authentication endpoints
- Room search and booking
- User management
- Error handling

## 🎨 Design System

### Color Palette
- Primary: `#111827` (Dark Gray)
- Secondary: `#374151` (Medium Gray)
- Accent: `#10b981` (Green)
- Error: `#dc2626` (Red)
- Warning: `#f59e0b` (Orange)

### Typography
- Headings: Inter, system fonts
- Body: System fonts with fallbacks
- Responsive font sizes

### Spacing
- Consistent spacing scale
- Responsive margins and padding
- Grid system for layouts

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- Mobile: `< 768px`
- Tablet: `768px - 1024px`
- Desktop: `> 1024px`

## 🔒 Security Features

- JWT token authentication
- Protected routes
- Input validation
- XSS protection
- CSRF protection (backend)

## 🧪 Testing

```bash
# Run tests (if configured)
npm run test

# Run tests in watch mode
npm run test:watch
```

## 📦 Build & Deployment

```bash
# Build for production
npm run build

# The built files will be in the 'dist' directory
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the component examples

---

Built with ❤️ using Vue 3 and modern web technologies.