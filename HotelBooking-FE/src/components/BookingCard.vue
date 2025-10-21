<script setup>
import { getRoomImage } from '../utils/imageUtils.js'

const props = defineProps({
  booking: {
    type: Object,
    required: true
  },
  isUpcoming: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['cancel-booking'])

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  })
}

function calculateNights(checkIn, checkOut) {
  const start = new Date(checkIn)
  const end = new Date(checkOut)
  return Math.ceil((end - start) / (1000 * 60 * 60 * 24))
}

function handleCancelBooking() {
  emit('cancel-booking', props.booking.id)
}
</script>

<template>
  <div :class="['booking-card', { upcoming: isUpcoming, past: !isUpcoming }]">
    <div class="card-header">
      <div class="booking-id">
        <span class="id-label">Booking</span>
        <span class="id-number">#{{ booking.id }}</span>
      </div>
      <div :class="['booking-status', booking.status]">
        <span class="status-dot"></span>
        {{ booking.status }}
      </div>
    </div>
    
    <div class="room-image">
      <img :src="getRoomImage(booking.room)" :alt="booking.room?.room_name || 'Room'" />
    </div>
    
    <div class="room-info">
      <h3>{{ booking.room?.room_name || 'Room Details' }}</h3>
      <p class="room-number">Room {{ booking.room?.room_number || 'N/A' }}</p>
    </div>
    
    <div class="booking-dates">
      <div class="date-item">
        <span class="date-label">Check-in</span>
        <span class="date-value">{{ formatDate(booking.check_in) }}</span>
      </div>
      <div class="date-item">
        <span class="date-label">Check-out</span>
        <span class="date-value">{{ formatDate(booking.check_out) }}</span>
      </div>
      <div class="date-item">
        <span class="date-label">Duration</span>
        <span class="date-value">{{ calculateNights(booking.check_in, booking.check_out) }} night{{ calculateNights(booking.check_in, booking.check_out) > 1 ? 's' : '' }}</span>
      </div>
      <div class="date-item">
        <span class="date-label">Guests</span>
        <span class="date-value">{{ booking.number_of_guests }}</span>
      </div>
    </div>

    <!-- Total Breakdown -->
    <div class="breakdown-section">
      <div class="breakdown-header">
        <span class="breakdown-title">Cost Breakdown</span>
      </div>
      <div class="breakdown-items">
        <div class="breakdown-item">
          <span class="breakdown-label">Accommodation:</span>
          <span class="breakdown-value">${{ (parseFloat(booking.total_fee || 0) * 0.85).toFixed(2) }}</span>
        </div>
        <div class="breakdown-item">
          <span class="breakdown-label">Service & Tax:</span>
          <span class="breakdown-value">${{ (parseFloat(booking.total_fee || 0) * 0.15).toFixed(2) }}</span>
        </div>
        <div class="breakdown-item total">
          <span class="breakdown-label">Total:</span>
          <span class="breakdown-value">${{ parseFloat(booking.total_fee || 0).toFixed(2) }}</span>
        </div>
      </div>
    </div>
    
    <div class="booking-actions">
      <button 
        v-if="booking.status !== 'cancelled'"
        @click="handleCancelBooking" 
        class="cancel-btn"
      >
        Cancel Booking
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Booking Card */
.booking-card {
  position: relative;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid rgba(226, 232, 240, 0.5);
  border-radius: 12px;
  padding: 1rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: visible;
}

.booking-card::before {
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

.booking-card:hover::before {
  opacity: 1;
}

.booking-card:hover {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  transform: translateY(-6px) scale(1.02);
  border-color: rgba(17, 24, 39, 0.1);
}

.booking-card.upcoming {
  border-left: 4px solid #e5e7eb;
}

.booking-card.past {
  opacity: 0.9;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  border-left: 4px solid #6b7280;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.booking-id {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.id-label {
  font-size: 0.625rem;
  color: #9ca3af;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.id-number {
  font-weight: 700;
  color: #111827;
  font-size: 0.875rem;
}

.booking-status {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.875rem;
  border-radius: 16px;
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.booking-status.confirmed {
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  color: #166534;
}

.booking-status.cancelled {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  color: #991b1b;
}

.booking-status.pending {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #92400e;
}

/* Room Image */
.room-image {
  height: 120px;
  overflow: hidden;
  margin-bottom: 1rem;
  border-radius: 8px;
  position: relative;
}

.room-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.booking-card:hover .room-image img {
  transform: scale(1.05);
}

.room-info {
  margin-bottom: 1rem;
}

.room-info h3 {
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.125rem;
  line-height: 1.3;
}

.room-number {
  color: #6b7280;
  font-size: 0.75rem;
  margin: 0;
  font-weight: 500;
}

.booking-dates {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.date-item {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  padding: 0.5rem;
  background: rgba(248, 250, 252, 0.5);
  border-radius: 6px;
  border: 1px solid rgba(226, 232, 240, 0.3);
}

.date-label {
  font-size: 0.625rem;
  color: #9ca3af;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.date-value {
  font-size: 0.75rem;
  color: #111827;
  font-weight: 700;
}

/* Breakdown Section */
.breakdown-section {
  margin-bottom: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(226, 232, 240, 0.5);
}

.breakdown-header {
  margin-bottom: 0.5rem;
}

.breakdown-title {
  font-size: 0.75rem;
  color: #9ca3af;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.breakdown-items {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.breakdown-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.25rem 0;
}

.breakdown-item.total {
  border-top: 1px solid rgba(226, 232, 240, 0.3);
  padding-top: 0.5rem;
  margin-top: 0.25rem;
  font-weight: 700;
}

.breakdown-label {
  font-size: 0.75rem;
  color: #9ca3af;
  font-weight: 600;
}

.breakdown-item.total .breakdown-label {
  color: #111827;
  font-weight: 700;
  font-size: 0.875rem;
}

.breakdown-value {
  font-size: 0.875rem;
  color: #111827;
  font-weight: 600;
}

.breakdown-item.total .breakdown-value {
  font-size: 1rem;
  font-weight: 800;
  color: #111827;
}

.booking-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(226, 232, 240, 0.5);
  position: relative;
  z-index: 10;
}

.cancel-btn {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 6px 20px rgba(220, 38, 38, 0.3);
  position: relative;
  z-index: 20;
  pointer-events: auto;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.cancel-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 35px rgba(220, 38, 38, 0.4);
}

.cancel-btn:active {
  transform: translateY(-1px);
  box-shadow: 0 8px 25px rgba(220, 38, 38, 0.5);
}

.cancel-btn:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.3);
}

.cancel-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.cancel-btn:disabled:hover {
  transform: none;
  box-shadow: 0 6px 20px rgba(220, 38, 38, 0.3);
}

/* Responsive Design */
@media (max-width: 768px) {
  .booking-dates {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
}
</style>
