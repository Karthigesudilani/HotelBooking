<script setup>
import { ref, onMounted, watch } from 'vue'
import apiService from '../services/api.js'
import { useRouter, useRoute } from 'vue-router'
import RoomCard from '../components/RoomCard.vue'
import BookingSummary from '../components/BookingSummary.vue'
import EmptyState from '../components/EmptyState.vue'

const router = useRouter()
const route = useRoute()
const rooms = ref([])
const loading = ref(false)
const error = ref('')

// Check if we have search parameters
const hasSearchParams = () => {
  return route.query.destination || route.query.check_in || route.query.check_out || route.query.number_of_guests
}

// Format search criteria for display
const getSearchCriteria = () => {
  if (!hasSearchParams()) return null
  
  const criteria = []
  if (route.query.destination) criteria.push(`Destination: ${route.query.destination}`)
  if (route.query.check_in) criteria.push(`Check-in: ${route.query.check_in}`)
  if (route.query.check_out) criteria.push(`Check-out: ${route.query.check_out}`)
  if (route.query.number_of_guests) criteria.push(`Guests: ${route.query.number_of_guests}`)
  
  return criteria
}

// Format booking summary
const getBookingSummary = () => {
  if (!hasSearchParams()) return null
  
  const checkIn = route.query.check_in
  const checkOut = route.query.check_out
  const guests = route.query.number_of_guests
  
  if (!checkIn || !checkOut) return null
  
  const startDate = new Date(checkIn)
  const endDate = new Date(checkOut)
  const nights = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
  
  return {
    dates: `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} → ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
    nights: nights,
    guests: guests
  }
}

// Fetch rooms only if we have search parameters
async function fetchRooms() {
  if (!hasSearchParams()) {
    rooms.value = []
    return
  }
  
  loading.value = true
  error.value = ''
  try {
    const params = {
      destination: route.query.destination,
      check_in: route.query.check_in,
      check_out: route.query.check_out,
      number_of_guests: route.query.number_of_guests
    }
    const response = await apiService.searchRooms(params)
    rooms.value = response.data || []
  } catch (err) {
    error.value = err.message || 'Failed to load rooms'
  } finally {
    loading.value = false
  }
}

// Watch for route changes to refetch when params change
watch(() => route.query, () => {
  fetchRooms()
}, { immediate: true })

onMounted(() => {
  fetchRooms()
})

function bookRoom(roomId) {
  router.push({ 
    name: 'Contact', 
    query: { 
      room_id: roomId,
      check_in: route.query.check_in,
      check_out: route.query.check_out,
      number_of_guests: route.query.number_of_guests,
      destination: route.query.destination
    }
  })
}
</script>

<template>
  <div class="rooms-page">
    <!-- Header Section -->
    <div class="rooms-header">
      <div class="header-background">
        <div class="bg-pattern"></div>
        <div class="bg-gradient"></div>
      </div>
      <div class="header-content">
        <h1>Available Rooms</h1>
        <p>Discover your perfect accommodation</p>
      </div>
    </div>

    <!-- Booking Summary -->
    <BookingSummary 
      v-if="getBookingSummary()" 
      :booking-summary="getBookingSummary()" 
    />

    <!-- Content Section -->
    <div class="rooms-content">
      <!-- Loading State -->
      <EmptyState 
        v-if="loading" 
        type="loading" 
      />

      <!-- Error State -->
      <EmptyState 
        v-else-if="error" 
        type="error" 
        :error="error"
        @retry="fetchRooms"
      />

      <!-- No Search State -->
      <EmptyState 
        v-else-if="!hasSearchParams()" 
        type="no-search" 
      />

      <!-- No Rooms State -->
      <EmptyState 
        v-else-if="rooms.length === 0" 
        type="no-rooms"
        @retry="fetchRooms"
      />

      <!-- Rooms Grid -->
      <div v-else class="rooms-grid">
        <RoomCard 
          v-for="room in rooms" 
          :key="room.id" 
          :room="room"
          @book-room="bookRoom"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.rooms-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

/* Header Section */
.rooms-header {
  position: relative;
  background: linear-gradient(135deg, #111827 0%, #374151 50%, #1f2937 100%);
  color: white;
  padding: 4rem 2rem;
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

.header-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.badge-icon {
  font-size: 1.25rem;
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
  font-size: 1.125rem;
  color: #d1d5db;
  margin: 0 0 2rem;
  line-height: 1.6;
}

.header-stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-top: 2rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.stat-number {
  font-size: 2rem;
  font-weight: 800;
  color: white;
  background: linear-gradient(135deg, #ffffff 0%, #e5e7eb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 0.875rem;
  color: #d1d5db;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Booking Summary - Moved to BookingSummary component */

/* Content Section */
.rooms-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

/* Loading, Error, and Empty States - Moved to EmptyState component */

/* Rooms Grid */
.rooms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
}

/* Room Card - Moved to RoomCard component */

/* Responsive Design */
@media (max-width: 768px) {
  .rooms-header {
    padding: 1.5rem 1rem;
  }
  
  .header-content h1 {
    font-size: 1.75rem;
  }
  
  .rooms-content {
    padding: 1rem;
  }
  
  .rooms-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

/* No Rooms State - Moved to EmptyState component */
</style>
