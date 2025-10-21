<script setup>
import { ref, onMounted, computed } from 'vue'
import apiService from '../services/api.js'
import { isLoggedIn, logout } from '../state/auth.js'
import { useRouter } from 'vue-router'
import DashboardHeader from '../components/DashboardHeader.vue'
import BookingCard from '../components/BookingCard.vue'
import CancelBookingModal from '../components/CancelBookingModal.vue'

const router = useRouter()
const bookings = ref([])
const loading = ref(false)
const error = ref('')
const activeTab = ref('upcoming')
const showCancelModal = ref(false)
const bookingToCancel = ref(null)

onMounted(async () => {
  if (!isLoggedIn.value) {
    router.push('/login')
    return
  }
  
  await fetchBookings()
})

async function fetchBookings() {
  loading.value = true
  error.value = ''

  try {
    const response = await apiService.getBookings()
    bookings.value = response.data || []
    console.log('Fetched bookings:', bookings.value)
  } catch (err) {
    if (err.message === 'Unauthenticated.' || err.message.includes('401')) {
      // Token expired, logout user
      logout()
      router.push('/login')
      return
    }
    error.value = err.message || 'Failed to load bookings'
  } finally {
    loading.value = false
  }
}

async function cancelBooking(bookingId) {
  console.log('Cancel booking clicked for ID:', bookingId)
  console.log('Available bookings:', bookings.value)
  
  const booking = bookings.value.find(b => b.id === bookingId)
  console.log('Found booking:', booking)
  
  if (booking) {
    bookingToCancel.value = booking
    showCancelModal.value = true
    console.log('Modal should be showing now')
  } else {
    console.error('Booking not found with ID:', bookingId)
  }
}

async function confirmCancellation() {
  console.log('Confirm cancellation clicked')
  console.log('Booking to cancel:', bookingToCancel.value)
  
  if (!bookingToCancel.value) {
    console.error('No booking to cancel')
    return
  }
  
  try {
    console.log('Calling API to cancel booking:', bookingToCancel.value.id)
    await apiService.cancelBooking(bookingToCancel.value.id)
    console.log('Booking cancelled successfully')
    
    // Refresh bookings
    await fetchBookings()
    showCancelModal.value = false
    bookingToCancel.value = null
  } catch (err) {
    console.error('Error cancelling booking:', err)
    if (err.message === 'Unauthenticated.' || err.message.includes('401')) {
      // Token expired, logout user
      logout()
      router.push('/login')
      return
    }
    error.value = err.message || 'Failed to cancel booking'
  }
}

function closeCancelModal() {
  showCancelModal.value = false
  bookingToCancel.value = null
}

const upcomingBookings = computed(() => 
  bookings.value.filter(b => new Date(b.check_out) >= new Date())
)
const pastBookings = computed(() => 
  bookings.value.filter(b => new Date(b.check_out) < new Date())
)

</script>

<template>
  <div class="dashboard-page">
    <!-- Header Section -->
    <DashboardHeader />

    <!-- Stats Cards -->
    <div class="stats-section">
      <div class="stats-grid">
        <div class="stat-card upcoming">
          <div class="card-glow"></div>
          <div class="stat-icon">
            <div class="icon-bg">📅</div>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ upcomingBookings.length }}</div>
            <div class="stat-label">Upcoming Bookings</div>
            <div class="stat-trend">
              <span class="trend-icon">↗</span>
              <span>Active</span>
            </div>
          </div>
        </div>
        <div class="stat-card past">
          <div class="card-glow"></div>
          <div class="stat-icon">
            <div class="icon-bg">📋</div>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ pastBookings.length }}</div>
            <div class="stat-label">Past Bookings</div>
            <div class="stat-trend">
              <span class="trend-icon">✓</span>
              <span>Completed</span>
            </div>
          </div>
        </div>
        <div class="stat-card total">
          <div class="card-glow"></div>
          <div class="stat-icon">
            <div class="icon-bg">⭐</div>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ bookings.length }}</div>
            <div class="stat-label">Total Bookings</div>
            <div class="stat-trend">
              <span class="trend-icon">📊</span>
              <span>All Time</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="dashboard-content">
      <!-- Tab Navigation -->
      <div class="tab-navigation">
        <button 
          :class="['tab-button', { active: activeTab === 'upcoming' }]"
          @click="activeTab = 'upcoming'"
        >
          <span class="tab-icon">📅</span>
          Upcoming Bookings
          <span class="tab-count">{{ upcomingBookings.length }}</span>
        </button>
        <button 
          :class="['tab-button', { active: activeTab === 'past' }]"
          @click="activeTab = 'past'"
        >
          <span class="tab-icon">📋</span>
          Past Bookings
          <span class="tab-count">{{ pastBookings.length }}</span>
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Loading your bookings...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <div class="error-icon">⚠️</div>
        <p>{{ error }}</p>
        <button @click="fetchBookings" class="retry-btn">Try Again</button>
      </div>

      <!-- Bookings Content -->
      <div v-else class="bookings-content">
        <!-- Upcoming Bookings Tab -->
        <div v-if="activeTab === 'upcoming'" class="bookings-tab">
          <div v-if="upcomingBookings.length === 0" class="empty-state">
            <div class="empty-icon">🏨</div>
            <h3>No upcoming bookings</h3>
            <p>You don't have any upcoming reservations. Start planning your next trip!</p>
            <router-link to="/" class="book-now-btn">
              <span class="btn-icon">+</span>
              Book a Room
            </router-link>
          </div>
          
          <div v-else class="bookings-grid">
            <BookingCard 
              v-for="booking in upcomingBookings" 
              :key="booking.id" 
              :booking="booking"
              :is-upcoming="true"
              @cancel-booking="cancelBooking"
            />
          </div>
        </div>

        <!-- Past Bookings Tab -->
        <div v-if="activeTab === 'past'" class="bookings-tab">
          <div v-if="pastBookings.length === 0" class="empty-state">
            <div class="empty-icon">📋</div>
            <h3>No past bookings</h3>
            <p>You haven't made any reservations yet. Start your journey with us!</p>
            <router-link to="/" class="book-now-btn">
              <span class="btn-icon">+</span>
              Book a Room
            </router-link>
          </div>
          
          <div v-else class="bookings-grid">
            <BookingCard 
              v-for="booking in pastBookings" 
              :key="booking.id" 
              :booking="booking"
              :is-upcoming="false"
              @cancel-booking="cancelBooking"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Cancellation Confirmation Modal -->
    <CancelBookingModal 
      :show="showCancelModal"
      :booking="bookingToCancel"
      @close="closeCancelModal"
      @confirm="confirmCancellation"
    />
  </div>
</template>

<style scoped>
.dashboard-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  position: relative;
}

.dashboard-page::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="%23000" opacity="0.02"/><circle cx="75" cy="75" r="1" fill="%23000" opacity="0.02"/><circle cx="50" cy="10" r="0.5" fill="%23000" opacity="0.03"/><circle cx="10" cy="60" r="0.5" fill="%23000" opacity="0.03"/><circle cx="90" cy="40" r="0.5" fill="%23000" opacity="0.03"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  pointer-events: none;
  z-index: 0;
}

/* Header Section - Moved to DashboardHeader component */

/* Stats Section */
.stats-section {
  max-width: 1200px;
  margin: 0 auto 1rem;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 0.75rem;
}

.stat-card {
  position: relative;
  background: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(17, 24, 39, 0.02) 0%, rgba(17, 24, 39, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.stat-card:hover::before {
  opacity: 1;
}

.stat-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
}

.card-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(17, 24, 39, 0.1) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.stat-card:hover .card-glow {
  opacity: 1;
}

.stat-card.upcoming {
  border-left: 4px solid #10b981;
}

.stat-card.past {
  border-left: 4px solid #6b7280;
}

.stat-card.total {
  border-left: 4px solid #f59e0b;
}

.stat-icon {
  position: relative;
  z-index: 2;
}

.icon-bg {
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 10px;
  font-size: 1.25rem;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.stat-card:hover .icon-bg {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
}

.stat-content {
  flex: 1;
  position: relative;
  z-index: 2;
}

.stat-number {
  font-size: 2rem;
  font-weight: 800;
  color: #111827;
  margin: 0 0 0.125rem;
  background: linear-gradient(135deg, #111827 0%, #374151 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 600;
  margin: 0 0 0.25rem;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: #9ca3af;
  font-weight: 500;
}

.trend-icon {
  font-size: 0.875rem;
}

/* Dashboard Content */
.dashboard-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
}

/* Tab Navigation */
.tab-navigation {
  display: flex;
  background: white;
  border-radius: 16px;
  padding: 0.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(20px);
}

.tab-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border: none;
  background: transparent;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.75rem;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.tab-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(17, 24, 39, 0.05) 0%, rgba(17, 24, 39, 0.02) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.tab-button:hover::before {
  opacity: 1;
}

.tab-button:hover {
  color: #374151;
  transform: translateY(-2px);
}

.tab-button.active {
  background: linear-gradient(135deg, #111827 0%, #374151 100%);
  color: white;
  box-shadow: 0 8px 25px rgba(17, 24, 39, 0.3);
  transform: translateY(-2px);
}

.tab-icon {
  font-size: 1rem;
  transition: transform 0.3s ease;
}

.tab-button:hover .tab-icon {
  transform: scale(1.1);
}

.tab-count {
  background: rgba(107, 114, 128, 0.1);
  color: #6b7280;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.625rem;
  font-weight: 700;
  transition: all 0.3s ease;
}

.tab-button.active .tab-count {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6rem 2rem;
  background: white;
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #111827;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1.5rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state p {
  color: #6b7280;
  font-size: 1.125rem;
  font-weight: 500;
}

/* Error State */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6rem 2rem;
  background: white;
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.error-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}

.error-state p {
  color: #dc2626;
  font-size: 1.125rem;
  margin-bottom: 2rem;
  text-align: center;
  font-weight: 500;
}

.retry-btn {
  background: linear-gradient(135deg, #111827 0%, #374151 100%);
  color: white;
  border: none;
  padding: 1rem 2.5rem;
  border-radius: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 25px rgba(17, 24, 39, 0.3);
}

.retry-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 35px rgba(17, 24, 39, 0.4);
}

/* Bookings Content */
.bookings-content {
  background: white;
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
  backdrop-filter: blur(20px);
}

.bookings-tab {
  padding: 1.5rem;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6rem 2rem;
  text-align: center;
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: 2rem;
  animation: float 3s ease-in-out infinite;
}

.empty-state h3 {
  font-size: 1.75rem;
  font-weight: 800;
  color: #111827;
  margin: 0 0 1rem;
}

.empty-state p {
  color: #6b7280;
  font-size: 1.125rem;
  margin: 0 0 2.5rem;
  max-width: 500px;
  line-height: 1.6;
}

.book-now-btn {
  background: linear-gradient(135deg, #111827 0%, #374151 100%);
  color: white;
  text-decoration: none;
  padding: 1.25rem 2.5rem;
  border-radius: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 25px rgba(17, 24, 39, 0.3);
}

.book-now-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 35px rgba(17, 24, 39, 0.4);
}

/* Bookings Grid */
.bookings-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(2, 1fr);
}

/* Booking Card - Moved to BookingCard component */

/* Modal Styles - Moved to CancelBookingModal component */

/* Responsive Design */
@media (max-width: 768px) {
  .dashboard-page {
    padding: 1rem;
  }
  
  .stats-section,
  .dashboard-content {
    padding: 0 1rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .stat-card {
    padding: 2rem;
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
  }
  
  .tab-navigation {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .tab-button {
    padding: 1rem 1.5rem;
  }
  
  .bookings-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  
  .bookings-tab {
    padding: 2rem;
  }
}

@media (max-width: 480px) {
  .stat-card {
    padding: 1.5rem;
  }
  
  .icon-bg {
    width: 60px;
    height: 60px;
    font-size: 2rem;
  }
  
  .stat-number {
    font-size: 2rem;
  }
  
  .bookings-tab {
    padding: 1.5rem;
  }
}
</style>
