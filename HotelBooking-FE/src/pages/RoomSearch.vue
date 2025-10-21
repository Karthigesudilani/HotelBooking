<script setup>
import { ref } from 'vue'
import apiService from '../services/api.js'
import { useRouter } from 'vue-router'

const router = useRouter()
const checkIn = ref('')
const checkOut = ref('')
const guests = ref(1)
const loading = ref(false)
const error = ref('')

async function handleSearch() {
  error.value = ''
  
  // Validate dates
  if (!checkIn.value || !checkOut.value) {
    error.value = 'Please select both check-in and check-out dates'
    return
  }
  
  if (new Date(checkIn.value) >= new Date(checkOut.value)) {
    error.value = 'Check-out date must be after check-in date'
    return
  }
  
  loading.value = true
  try {
    const params = {
      check_in: checkIn.value,
      check_out: checkOut.value,
      number_of_guests: guests.value
    }
    // Navigate to rooms with search parameters
    router.push({ 
      name: 'Rooms', 
      query: params 
    })
  } catch (err) {
    error.value = err.message || 'Search failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="search-page">
    <!-- Header Section with Image -->
    <div class="search-header">
      <div class="header-image">
        <img src="../assets/hotel-room-design-compressed-1.jpg" alt="Luxury Hotel Room" />
        <div class="image-overlay"></div>
      </div>
      <div class="header-content">
        <div class="welcome-section">
          <h1>Find Your Perfect Stay</h1>
          <p>Discover amazing rooms and book your dream vacation</p>
        </div>
      </div>
    </div>

    <!-- Search Form Section -->
    <div class="search-container">
      <div class="search-card">
        <div class="card-header">
          <h2>Search Rooms</h2>
          <p>Enter your travel details to find available rooms</p>
        </div>

        <form class="search-form" @submit.prevent="handleSearch">
          <div class="form-row">
            <div class="form-group">
              <label for="checkIn" class="form-label">Check-in</label>
              <input
                id="checkIn"
                v-model="checkIn"
                type="date"
                class="form-input"
                required
              />
            </div>

            <div class="form-group">
              <label for="checkOut" class="form-label">Check-out</label>
              <input
                id="checkOut"
                v-model="checkOut"
                type="date"
                class="form-input"
                required
              />
            </div>

            <div class="form-group">
              <label for="guests" class="form-label">Guests</label>
              <input
                id="guests"
                v-model.number="guests"
                type="number"
                min="1"
                max="10"
                class="form-input"
                required
              />
            </div>
          </div>

          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <button type="submit" :disabled="loading" class="search-btn">
            <span v-if="loading" class="loading-spinner"></span>
            {{ loading ? 'Searching...' : 'Search Rooms' }}
          </button>
        </form>
      </div>
    </div>

    <!-- Gallery Section -->
    <div class="gallery-section">
      <div class="gallery-container">
        <div class="gallery-header">
          <h3>Explore Our Rooms</h3>
          <p>Discover the luxury and comfort that awaits you</p>
        </div>
        
        <div class="gallery-grid">
          <div class="gallery-item">
            <img src="../assets/hotel-room.jpg" alt="Luxury Hotel Room" />
          </div>
          
          <div class="gallery-item">
            <img src="../assets/what-is-a-deluxe-room-2-1024x675.jpg" alt="Deluxe Room" />
          </div>
          
          <div class="gallery-item">
            <img src="../assets/istockphoto-1357529812-612x612.jpg" alt="Hotel Interior" />
          </div>
          
          <div class="gallery-item">
            <img src="../assets/images.jpeg" alt="Hotel View" />
          </div>
          
          <div class="gallery-item">
            <img src="../assets/hotel-room-design-compressed-1.jpg" alt="Hotel Room Design" />
          </div>
          
          <div class="gallery-item">
            <img src="../assets/hotel-room.jpg" alt="Luxury Hotel Room" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-page {
  min-height: 100vh;
  /* background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); */
}

/* Header Section */
.search-header {
  position: relative;
  height: 40vh;
  overflow: hidden;
}

.header-image {
  position: relative;
  width: 100%;
  height: 100%;
}

.header-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(17, 24, 39, 0.7) 0%, rgba(55, 65, 81, 0.5) 100%);
  z-index: 1;
}

.header-content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
}

.welcome-section {
  max-width: 600px;
  padding: 0 2rem;
}

.welcome-section h1 {
  font-size: 3.5rem;
  font-weight: 800;
  margin: 0 0 1rem;
  color: white;
  background: linear-gradient(135deg, #ffffff 0%, #e5e7eb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.1;
}

.welcome-section p {
  font-size: 1.25rem;
  color: #d1d5db;
  margin: 0;
  line-height: 1.6;
}

/* Search Container */
.search-container {
  max-width: 1200px;
  margin: -3rem auto 0;
  padding: 0 2rem;
  position: relative;
  z-index: 10;
}

.search-card {
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(226, 232, 240, 0.5);
  backdrop-filter: blur(20px);
}

.card-header {
  text-align: center;
  margin-bottom: 2rem;
}

.card-header h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.5rem;
}

.card-header p {
  font-size: 1rem;
  color: #6b7280;
  margin: 0;
}

/* Form Styles */
.form-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-input {
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

.form-input:focus {
  outline: none;
  border-color: #111827;
  box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.1);
}

.form-input:hover {
  border-color: #9ca3af;
}

/* Error Message */
.error-message {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
}

/* Search Button */
.search-btn {
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
}

.search-btn:hover:not(:disabled) {
  background: #374151;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(17, 24, 39, 0.3);
}

.search-btn:active:not(:disabled) {
  transform: translateY(0);
}

.search-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Gallery Section */
.gallery-section {
  padding: 4rem 2rem;
  background: white;
}

.gallery-container {
  max-width: 1200px;
  margin: 0 auto;
}

.gallery-header {
  text-align: center;
  margin-bottom: 3rem;
}

.gallery-header h3 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 1rem;
}

.gallery-header p {
  font-size: 1.125rem;
  color: #6b7280;
  margin: 0;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.gallery-item {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.gallery-item:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.gallery-item img {
  width: 100%;
  height: 250px;
  object-fit: cover;
  object-position: center;
  transition: transform 0.4s ease;
}

.gallery-item:hover img {
  transform: scale(1.1);
}

/* Responsive Design */
@media (max-width: 768px) {
  .search-header {
    height: 50vh;
  }
  
  .welcome-section h1 {
    font-size: 2.5rem;
  }
  
  .welcome-section p {
    font-size: 1rem;
  }
  
  .search-container {
    padding: 0 1rem;
    margin: -2rem auto 0;
  }
  
  .search-card {
    padding: 2rem 1.5rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>


