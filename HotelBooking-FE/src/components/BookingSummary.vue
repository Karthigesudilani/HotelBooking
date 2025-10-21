<script setup>
const props = defineProps({
  bookingSummary: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="booking-summary">
    <div class="summary-content">
      <div class="summary-dates">
        <div class="date-range">{{ bookingSummary.dates }}</div>
        <div class="stay-details">{{ bookingSummary.nights }} NIGHT{{ bookingSummary.nights > 1 ? 'S' : '' }} • {{ bookingSummary.guests }} GUEST{{ bookingSummary.guests > 1 ? 'S' : '' }}</div>
      </div>
      <div class="summary-actions">
        <router-link to="/" class="modify-search-btn">Modify Search</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Booking Summary */
.booking-summary {
  max-width: 1200px;
  margin: -1rem auto 0;
  padding: 0 2rem;
  position: relative;
  z-index: 10;
}

.summary-content {
  background: white;
  border-radius: 12px;
  padding: 1rem 1.5rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(226, 232, 240, 0.5);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-dates {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.date-range {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
}

.stay-details {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.modify-search-btn {
  background: #f3f4f6;
  color: #374151;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.modify-search-btn:hover {
  background: #e5e7eb;
}

/* Responsive Design */
@media (max-width: 768px) {
  .booking-summary {
    padding: 0 1rem;
  }
  
  .summary-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style>
