<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import apiService from '../services/api.js'
import { getRoomImage } from '../utils/imageUtils.js'

const route = useRoute()
const booking = ref(null)
const room = ref(null)
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    const bookingId = route.query.booking_id
    if (bookingId) {
      // Get booking details from the URL parameters
      const bookingData = {
        id: bookingId,
        room_id: route.query.room_id,
        check_in: route.query.check_in,
        check_out: route.query.check_out,
        guests: route.query.guests,
        title: route.query.title,
        name: route.query.name,
        email: route.query.email
      }
      
      // Get room details
      if (bookingData.room_id) {
        room.value = await apiService.getRoom(bookingData.room_id)
      }
      
      // Calculate booking summary
      if (bookingData.check_in && bookingData.check_out && room.value) {
        const startDate = new Date(bookingData.check_in)
        const endDate = new Date(bookingData.check_out)
        const nights = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
        
        const roomPrice = room.value.price_per_night * nights
        const serviceAndTaxFee = room.value.service_and_tax_fee * nights
        const total = roomPrice + serviceAndTaxFee
        
        booking.value = {
          ...bookingData,
          nights: nights,
          roomPrice: roomPrice,
          serviceAndTaxFee: serviceAndTaxFee,
          total: total,
          confirmationNumber: `RES${bookingId.toString().padStart(9, '0')}`
        }
      }
    }
  } catch (err) {
    error.value = 'Failed to load booking details'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="confirmation-page">
    <!-- Header Section -->
    <div class="confirmation-header">
      <div class="header-background">
        <div class="bg-pattern"></div>
        <div class="bg-gradient"></div>
      </div>
      <div class="header-content">
        <div class="success-icon">✓</div>
        <h1>Booking Confirmed!</h1>
        <p>Your reservation has been successfully created</p>
      </div>
    </div>

    <div class="confirmation-container">
      <!-- Confirmation Summary Card -->
      <div class="summary-card">
        <div class="summary-header">
          <h2>Booking Summary</h2>
          <div class="confirmation-number">
            <span class="number-label">Confirmation #</span>
            <span class="number-value">{{ booking?.confirmationNumber || 'Loading...' }}</span>
          </div>
        </div>

        <!-- Room Image -->
        <div class="room-image-section">
          <img :src="getRoomImage(room)" :alt="room?.room_name || 'Room'" />
          <div class="image-overlay">
            <div class="room-badge">{{ room?.room_name || 'Loading...' }}</div>
          </div>
        </div>

        <!-- Booking Details -->
        <div class="booking-details">
          <div class="detail-item">
            <span class="detail-label">Check-in</span>
            <span class="detail-value">{{ booking?.check_in ? new Date(booking.check_in).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Loading...' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Check-out</span>
            <span class="detail-value">{{ booking?.check_out ? new Date(booking.check_out).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Loading...' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Duration</span>
            <span class="detail-value">{{ booking?.nights || 0 }} night{{ (booking?.nights || 0) > 1 ? 's' : '' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Guests</span>
            <span class="detail-value">{{ booking?.guests || 0 }} guest{{ (booking?.guests || 0) > 1 ? 's' : '' }}</span>
          </div>
        </div>

        <!-- Guest Information -->
        <div class="guest-section">
          <h3>Guest Information</h3>
          <div class="guest-details">
            <div class="guest-item">
              <span class="guest-label">Name</span>
              <span class="guest-value">{{ booking?.title || '' }} {{ booking?.name || 'Loading...' }}</span>
            </div>
            <div class="guest-item">
              <span class="guest-label">Email</span>
              <span class="guest-value">{{ booking?.email || 'Loading...' }}</span>
            </div>
          </div>
        </div>

        <!-- Cost Breakdown -->
        <div class="cost-breakdown">
          <h3>Cost Breakdown</h3>
          <div class="cost-item">
            <span class="cost-label">Accommodation</span>
            <span class="cost-value">${{ booking?.roomPrice?.toFixed(2) || '0.00' }}</span>
          </div>
          <div class="cost-item">
            <span class="cost-label">Service & Tax</span>
            <span class="cost-value">${{ booking?.serviceAndTaxFee?.toFixed(2) || '0.00' }}</span>
          </div>
          <div class="cost-item total">
            <span class="cost-label">Total</span>
            <span class="cost-value">${{ booking?.total?.toFixed(2) || '0.00' }}</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons">
          <router-link to="/dashboard" class="btn-primary">
            View My Bookings
          </router-link>
          <router-link to="/" class="btn-secondary">
            Book Another Room
          </router-link>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading booking details...</p>
    </div>

    <!-- Error State -->
    <div v-if="error" class="error-state">
      <div class="error-icon">⚠️</div>
      <p>{{ error }}</p>
    </div>
  </div>
</template>

<style scoped>
.confirmation-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

/* Header Section */
.confirmation-header {
  position: relative;
  background: linear-gradient(135deg, #111827 0%, #374151 50%, #1f2937 100%);
  color: white;
  padding: 2rem 2rem;
  text-align: center;
  overflow: hidden;
}

.header-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
}

.bg-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="%23000" opacity="0.02"/><circle cx="75" cy="75" r="1" fill="%23000" opacity="0.02"/><circle cx="50" cy="10" r="0.5" fill="%23000" opacity="0.03"/><circle cx="10" cy="60" r="0.5" fill="%23000" opacity="0.03"/><circle cx="90" cy="40" r="0.5" fill="%23000" opacity="0.03"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  pointer-events: none;
  z-index: 0;
}

.bg-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(17, 24, 39, 0.8) 0%, rgba(55, 65, 81, 0.6) 100%);
  z-index: 1;
}

.header-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
}

.success-icon {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 auto 1.5rem;
  border: 3px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

.header-content h1 {
  font-size: 3rem;
  font-weight: 800;
  margin: 0 0 1rem;
  background: linear-gradient(135deg, #ffffff 0%, #e5e7eb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.1;
}

.header-content p {
  font-size: 1.25rem;
  color: #d1d5db;
  margin: 0 0 2rem;
  line-height: 1.6;
}

.confirmation-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.badge-icon {
  font-size: 1.125rem;
}

/* Main Container */
.confirmation-container {
  max-width: 800px;
  margin: -1rem auto 0;
  padding: 0 2rem;
  position: relative;
  z-index: 10;
}

/* Summary Card */
.summary-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(226, 232, 240, 0.5);
  position: relative;
  overflow: hidden;
}

.summary-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #111827 0%, #374151 50%, #111827 100%);
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.summary-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
  letter-spacing: -0.025em;
}

.confirmation-number {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
}

.number-label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.number-value {
  font-size: 1rem;
  color: #111827;
  font-weight: 700;
  font-family: 'Courier New', monospace;
}

/* Room Image Section */
.room-image-section {
  position: relative;
  height: 250px;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 2rem;
}

.room-image-section img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.room-image-section:hover img {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  padding: 1rem;
}

.room-badge {
  background: rgba(255, 255, 255, 0.9);
  color: #111827;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  display: inline-block;
  backdrop-filter: blur(10px);
}

/* Booking Details */
.booking-details {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  text-align: center;
}

.detail-label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-value {
  font-size: 0.875rem;
  color: #111827;
  font-weight: 600;
}

/* Guest Section */
.guest-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.guest-section h3 {
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 1rem;
  letter-spacing: -0.025em;
}

.guest-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.guest-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.guest-label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.guest-value {
  font-size: 0.875rem;
  color: #111827;
  font-weight: 600;
}

/* Cost Breakdown */
.cost-breakdown {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.cost-breakdown h3 {
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 1rem;
  letter-spacing: -0.025em;
}

.cost-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.cost-item.total {
  font-weight: 700;
  font-size: 1.125rem;
  color: #111827;
  padding-top: 0.75rem;
  border-top: 1px solid #e5e7eb;
  margin-top: 0.5rem;
}

.cost-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.cost-value {
  font-size: 0.875rem;
  color: #111827;
  font-weight: 600;
}

.cost-item.total .cost-label,
.cost-item.total .cost-value {
  font-size: 1rem;
  font-weight: 700;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn-primary,
.btn-secondary {
  padding: 0.875rem 2rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 160px;
}

.btn-primary {
  background: #111827;
  color: white;
}

.btn-primary:hover {
  background: #374151;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(17, 24, 39, 0.3);
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #e5e7eb;
}

.btn-secondary:hover {
  background: #e5e7eb;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

/* Loading and Error States */
.loading-state,
.error-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  margin: 2rem auto;
  max-width: 400px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #111827;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.loading-state p,
.error-state p {
  font-size: 1rem;
  color: #6b7280;
  margin: 0;
}

.error-state p {
  color: #dc2626;
}

/* Responsive Design */
@media (max-width: 768px) {
  .confirmation-container {
    margin-top: 0;
    padding: 1rem;
  }
  
  .confirmation-header {
    padding: 1.5rem 1rem;
  }
  
  .header-content h1 {
    font-size: 2rem;
  }
  
  .summary-card {
    padding: 1.5rem;
  }
  
  .summary-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .confirmation-number {
    align-items: flex-start;
  }
  
  .booking-details {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
  
  .guest-details {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .room-image-section {
    height: 200px;
  }
}

@media (max-width: 480px) {
  .confirmation-page {
    padding: 0;
  }
  
  .confirmation-container {
    padding: 0.5rem;
  }
  
  .summary-card {
    padding: 1rem;
  }
  
  .booking-details {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  .header-content h1 {
    font-size: 1.75rem;
  }
  
  .success-icon {
    width: 60px;
    height: 60px;
    font-size: 2rem;
  }
}
</style>
