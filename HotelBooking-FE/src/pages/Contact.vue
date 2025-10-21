<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import apiService from '../services/api.js'
import { isLoggedIn, currentUser, loadUser } from '../state/auth.js'
import { getRoomImage } from '../utils/imageUtils.js'

const router = useRouter()
const route = useRoute()
const title = ref('Mr.')
const name = ref('')
const email = ref('')
const loading = ref(false)
const error = ref('')
const selectedRoom = ref(null)
const bookingSummary = ref(null)

onMounted(async () => {
  // Load user data if logged in but user data is not available
  if (isLoggedIn.value && !currentUser.value) {
    console.log('Loading user data...')
    await loadUser()
  }
  
  // Fill user details if logged in
  if (isLoggedIn.value && currentUser.value) {
    console.log('Filling user data:', currentUser.value)
    name.value = currentUser.value.name || ''
    email.value = currentUser.value.email || ''
  } else {
    console.log('User not logged in or no user data available')
    console.log('isLoggedIn:', isLoggedIn.value)
    console.log('currentUser:', currentUser.value)
  }
  
  // Get room details if room_id is in query
  const roomId = route.query.room_id
  if (roomId) {
    try {
      // Get the specific room by ID
      const response = await apiService.getRoom(roomId)
      selectedRoom.value = response
      
      console.log('Room ID:', roomId)
      console.log('Selected room:', selectedRoom.value)
      
      // Calculate booking summary
      const checkIn = route.query.check_in
      const checkOut = route.query.check_out
      const guests = route.query.number_of_guests
      
      if (checkIn && checkOut && selectedRoom.value) {
        const startDate = new Date(checkIn)
        const endDate = new Date(checkOut)
        const nights = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
        
        const roomPrice = selectedRoom.value.price_per_night * nights
        const serviceAndTaxFee = selectedRoom.value.service_and_tax_fee * nights
        const total = roomPrice + serviceAndTaxFee
        
        bookingSummary.value = {
          dates: `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} → ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
          nights: nights,
          guests: guests,
          roomPrice: roomPrice,
          serviceAndTaxFee: serviceAndTaxFee,
          total: total
        }
        
        console.log('Booking summary:', bookingSummary.value)
      }
    } catch (err) {
      console.error('Error loading room details:', err)
      error.value = `Failed to load room details: ${err.message}`
    }
  }
})

// Watch for user data changes and auto-fill form
watch(currentUser, (newUser) => {
  if (newUser && isLoggedIn.value) {
    console.log('User data updated, filling form:', newUser)
    name.value = newUser.name || ''
    email.value = newUser.email || ''
  }
}, { immediate: true })

async function handleSubmit() {
  error.value = ''
  loading.value = true
  
  try {
    // Create booking via API
    const bookingData = {
      room_id: route.query.room_id,
      check_in: route.query.check_in,
      check_out: route.query.check_out,
      number_of_guests: route.query.number_of_guests,
      title: title.value,
      name: name.value,
      email: email.value
    }
    
    const response = await apiService.createBooking(bookingData)
    
    // Navigate to confirmation with booking details and all URL parameters
    router.push({ 
      name: 'Confirmation', 
      query: { 
        booking_id: response.id,
        room_id: route.query.room_id,
        check_in: route.query.check_in,
        check_out: route.query.check_out,
        number_of_guests: route.query.number_of_guests,
        destination: route.query.destination,
        title: title.value,
        name: name.value,
        email: email.value
      }
    })
  } catch (err) {
    error.value = err.message || 'Failed to create booking'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="contact-page">
    <!-- Header Section -->
    <div class="contact-header">
      <div class="header-background">
        <div class="bg-pattern"></div>
        <div class="bg-gradient"></div>
      </div>
      <div class="header-content">
        <h1>Complete Your Booking</h1>
        <p>Enter your contact information to proceed with your reservation</p>
      </div>
    </div>

    <div class="contact-container">
      <!-- Left Panel: Contact Information -->
      <div class="contact-form-panel">
        <div class="form-header">
          <h2>Contact Information</h2>
          <p>Please provide your details to complete the booking</p>
        </div>
        
        <form @submit.prevent="handleSubmit" class="contact-form">
          <div class="form-group">
            <label for="title" class="form-label">Title</label>
            <select id="title" v-model="title" class="form-select" required>
              <option value="Mr.">Mr.</option>
              <option value="Ms.">Ms.</option>
              <option value="Mrs.">Mrs.</option>
              <option value="Dr.">Dr.</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="name" class="form-label">Full Name</label>
            <input 
              id="name" 
              type="text" 
              v-model="name" 
              class="form-input"
              placeholder="Enter your full name"
              required 
            />
          </div>
          
          <div class="form-group">
            <label for="email" class="form-label">Email Address</label>
            <input 
              id="email" 
              type="email" 
              v-model="email" 
              class="form-input"
              placeholder="Enter your email address"
              required 
            />
          </div>
          
          <div v-if="error" class="error-message">
            {{ error }}
          </div>
          
          <button type="submit" :disabled="loading" class="proceed-btn">
            <span v-if="loading" class="loading-spinner"></span>
            {{ loading ? 'Processing...' : 'Complete Booking' }}
          </button>
        </form>
      </div>
      
      <!-- Right Panel: Booking Summary -->
      <div class="booking-summary-panel">
        <div class="summary-header">
          <h3>Booking Summary</h3>
          <p>Review your reservation details</p>
        </div>

        <!-- Room Image -->
        <div class="room-image-section">
          <img :src="getRoomImage(selectedRoom)" :alt="selectedRoom?.room_name || 'Room'" />
          <div class="image-overlay">
            <div class="room-badge">{{ selectedRoom?.room_name || 'Loading...' }}</div>
          </div>
        </div>

        <!-- Booking Details -->
        <div class="booking-details">
          <div class="detail-item">
            <span class="detail-label">Check-in</span>
            <span class="detail-value">{{ bookingSummary?.dates?.split(' → ')[0] || 'Loading...' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Check-out</span>
            <span class="detail-value">{{ bookingSummary?.dates?.split(' → ')[1] || 'Loading...' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Duration</span>
            <span class="detail-value">{{ bookingSummary?.nights || 0 }} night{{ (bookingSummary?.nights || 0) > 1 ? 's' : '' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Guests</span>
            <span class="detail-value">{{ bookingSummary?.guests || 0 }} guest{{ (bookingSummary?.guests || 0) > 1 ? 's' : '' }}</span>
          </div>
        </div>
        
        <!-- Cost Breakdown -->
        <div class="cost-breakdown">
          <h4>Cost Breakdown</h4>
          <div class="cost-item">
            <span class="cost-label">Accommodation</span>
            <span class="cost-value">${{ bookingSummary?.roomPrice?.toFixed(2) || '0.00' }}</span>
          </div>
          <div class="cost-item">
            <span class="cost-label">Service & Tax</span>
            <span class="cost-value">${{ bookingSummary?.serviceAndTaxFee?.toFixed(2) || '0.00' }}</span>
          </div>
          <div class="cost-item total">
            <span class="cost-label">Total</span>
            <span class="cost-value">${{ bookingSummary?.total?.toFixed(2) || '0.00' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.contact-page {
  min-height: 80vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

/* Header Section */
.contact-header {
  position: relative;
  background: linear-gradient(135deg, #111827 0%, #374151 50%, #1f2937 100%);
  color: white;
  padding: 3rem 2rem;
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

.header-content h1 {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0 0 1rem;
  background: linear-gradient(135deg, #ffffff 0%, #e5e7eb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.1;
}

.header-content p {
  font-size: 1.125rem;
  color: #d1d5db;
  margin: 0;
  line-height: 1.6;
}

/* Main Container */
.contact-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  max-width: 1200px;
  margin: -1rem auto 0;
  padding: 0 2rem;
  position: relative;
  z-index: 10;
}

/* Contact Form Panel */
.contact-form-panel {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(226, 232, 240, 0.5);
  position: relative;
  overflow: hidden;
}

.contact-form-panel::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #111827 0%, #374151 50%, #111827 100%);
}

.form-header {
  margin-bottom: 2rem;
}

.form-header h2 {
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.5rem;
  letter-spacing: -0.025em;
}

.form-header p {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-input,
.form-select {
  width: 100%;
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  color: #111827;
  background: white;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-sizing: border-box;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #111827;
  box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.1);
}

.form-input:hover,
.form-select:hover {
  border-color: #9ca3af;
}

.error-message {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
}

.proceed-btn {
  width: 100%;
  background: #111827;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.proceed-btn:hover:not(:disabled) {
  background: #374151;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(17, 24, 39, 0.3);
}

.proceed-btn:active:not(:disabled) {
  transform: translateY(0);
}

.proceed-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Booking Summary Panel */
.booking-summary-panel {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(226, 232, 240, 0.5);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: relative;
  overflow: hidden;
}

.booking-summary-panel::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #111827 0%, #374151 50%, #111827 100%);
}

.summary-header {
  margin-bottom: 0.25rem;
}

.summary-header h3 {
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.25rem;
  letter-spacing: -0.025em;
}

.summary-header p {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.4;
}

/* Room Image Section */
.room-image-section {
  position: relative;
  height: 180px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 0.75rem;
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
  padding: 0.5rem;
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
  gap: 0.25rem;
  margin-bottom: 0.25rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
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

/* Cost Breakdown */
.cost-breakdown {
  border-top: 1px solid #e5e7eb;
  padding-top: 0.5rem;
}

.cost-breakdown h4 {
  font-size: 0.875rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.5rem;
  letter-spacing: -0.025em;
}

.cost-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
}

.cost-item.total {
  font-weight: 700;
  font-size: 1rem;
  color: #111827;
  padding-top: 0.25rem;
  border-top: 1px solid #e5e7eb;
  margin-top: 0.125rem;
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
  font-size: 0.875rem;
  font-weight: 700;
}

/* Responsive Design */
@media (max-width: 768px) {
  .contact-container {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    margin-top: 0;
    padding: 1rem;
  }
  
  .contact-header {
    padding: 2rem 1rem;
  }
  
  .header-content h1 {
    font-size: 2rem;
  }
  
  .contact-form-panel,
  .booking-summary-panel {
    padding: 1.5rem;
  }
  
  .booking-details {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.125rem;
  }
  
  .room-image-section {
    height: 140px;
  }
}

@media (max-width: 480px) {
  .contact-page {
    padding: 0;
  }
  
  .contact-container {
    padding: 0.5rem;
  }
  
  .contact-form-panel,
  .booking-summary-panel {
    padding: 1rem;
  }
  
  .header-content h1 {
    font-size: 1.75rem;
  }
}
</style>
