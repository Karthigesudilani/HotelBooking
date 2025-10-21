<script setup>
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  booking: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'confirm'])

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  })
}

function handleClose() {
  emit('close')
}

function handleConfirm() {
  emit('confirm')
}
</script>

<template>
  <div v-if="show" class="modal-overlay" @click="handleClose">
    <div class="modal-container" @click.stop>
      <div class="modal-header">
        <div class="modal-icon">
          <div class="warning-icon">⚠️</div>
        </div>
        <h3 class="modal-title">Cancel Booking</h3>
        <button class="close-btn" @click="handleClose">
          <span>×</span>
        </button>
      </div>
      
      <div class="modal-content">
        <p class="modal-message">
          Are you sure you want to cancel this booking? This action cannot be undone.
        </p>
        
        <div v-if="booking" class="booking-summary">
          <div class="summary-item">
            <span class="summary-label">Booking ID:</span>
            <span class="summary-value">#{{ booking.id }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Room:</span>
            <span class="summary-value">{{ booking.room?.room_name || 'Room Details' }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Check-in:</span>
            <span class="summary-value">{{ formatDate(booking.check_in) }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Check-out:</span>
            <span class="summary-value">{{ formatDate(booking.check_out) }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Total Amount:</span>
            <span class="summary-value">${{ parseFloat(booking.total_fee || 0).toFixed(2) }}</span>
          </div>
        </div>
      </div>
      
      <div class="modal-actions">
        <button class="cancel-action-btn" @click="handleClose">
          Keep Booking
        </button>
        <button class="confirm-action-btn" @click="handleConfirm">
          Yes, Cancel Booking
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-container {
  background: white;
  border-radius: 20px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to { 
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  display: flex;
  align-items: center;
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid #e5e7eb;
  position: relative;
}

.modal-icon {
  margin-right: 1rem;
}

.warning-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  box-shadow: 0 8px 25px rgba(245, 158, 11, 0.3);
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
  flex: 1;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #9ca3af;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

.modal-content {
  padding: 1.5rem 2rem;
}

.modal-message {
  font-size: 1rem;
  color: #6b7280;
  margin: 0 0 1.5rem;
  line-height: 1.6;
}

.booking-summary {
  background: #f8fafc;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
}

.summary-item:last-child {
  border-bottom: none;
  font-weight: 700;
  padding-top: 0.75rem;
  margin-top: 0.5rem;
  border-top: 2px solid #e2e8f0;
}

.summary-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 600;
}

.summary-value {
  font-size: 0.875rem;
  color: #111827;
  font-weight: 600;
}

.summary-item:last-child .summary-value {
  font-size: 1rem;
  font-weight: 800;
  color: #111827;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  padding: 1rem 2rem 2rem;
  justify-content: flex-end;
}

.cancel-action-btn {
  background: #f3f4f6;
  color: #374151;
  border: none;
  padding: 0.875rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-action-btn:hover {
  background: #e5e7eb;
  transform: translateY(-2px);
}

.confirm-action-btn {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  color: white;
  border: none;
  padding: 0.875rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(220, 38, 38, 0.3);
}

.confirm-action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(220, 38, 38, 0.4);
}

/* Responsive Modal */
@media (max-width: 768px) {
  .modal-container {
    width: 95%;
    margin: 1rem;
  }
  
  .modal-header {
    padding: 1.5rem 1.5rem 1rem;
  }
  
  .modal-content {
    padding: 1rem 1.5rem;
  }
  
  .modal-actions {
    padding: 1rem 1.5rem 1.5rem;
    flex-direction: column;
  }
  
  .cancel-action-btn,
  .confirm-action-btn {
    width: 100%;
  }
}
</style>
