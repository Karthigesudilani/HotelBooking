<script setup>
const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ['loading', 'error', 'no-search', 'no-rooms'].includes(value)
  },
  message: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['retry', 'search'])

function handleRetry() {
  emit('retry')
}

function handleSearch() {
  emit('search')
}
</script>

<template>
  <!-- Loading State -->
  <div v-if="type === 'loading'" class="loading-state">
    <div class="loading-spinner"></div>
    <p>Loading rooms...</p>
  </div>

  <!-- Error State -->
  <div v-else-if="type === 'error'" class="error-state">
    <p>{{ error || message }}</p>
    <button @click="handleRetry" class="retry-btn">Try Again</button>
  </div>

  <!-- No Search State -->
  <div v-else-if="type === 'no-search'" class="no-search-state">
    <p>{{ message || 'Please search for rooms first to see available options.' }}</p>
    <router-link to="/" class="search-btn">Search Rooms</router-link>
  </div>

  <!-- No Rooms State -->
  <div v-else-if="type === 'no-rooms'" class="no-rooms-state">
    <div class="no-rooms-container">
      <div class="no-rooms-icon">
        <div class="icon-circle">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9 22V12H15V22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
      
      <div class="no-rooms-content">
        <h2 class="no-rooms-title">No rooms available</h2>
        <p class="no-rooms-subtitle">{{ message || 'We couldn\'t find any rooms matching your search criteria' }}</p>
        
        <div class="no-rooms-actions">
          <router-link to="/" class="modify-search-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Modify Search
          </router-link>
          <button @click="handleRetry" class="refresh-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M23 4V10H17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M20.49 15A9 9 0 1 1 5.64 5.64L23 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Refresh Results
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Loading State */
.loading-state {
  text-align: center;
  padding: 3rem 2rem;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #111827;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state p {
  font-size: 1rem;
  color: #6b7280;
  margin: 0;
}

/* Error State */
.error-state {
  text-align: center;
  padding: 3rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.error-state p {
  font-size: 1rem;
  color: #dc2626;
  margin: 0 0 1rem;
}

.retry-btn {
  background: #111827;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  background: #374151;
}

/* No Search State */
.no-search-state {
  text-align: center;
  padding: 3rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.no-search-state p {
  font-size: 1rem;
  color: #6b7280;
  margin: 0 0 1rem;
}

.search-btn {
  background: #111827;
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  display: inline-block;
  transition: all 0.3s ease;
}

.search-btn:hover {
  background: #374151;
}

/* No Rooms State */
.no-rooms-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding: 2rem;
}

.no-rooms-container {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  padding: 3rem;
  text-align: center;
  max-width: 600px;
  width: 100%;
  position: relative;
  overflow: hidden;
}

.no-rooms-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #ef4444 0%, #f97316 50%, #ef4444 100%);
}

.no-rooms-icon {
  margin-bottom: 2rem;
}

.icon-circle {
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  color: #ef4444;
  position: relative;
}

.icon-circle::after {
  content: '';
  position: absolute;
  inset: -4px;
  background: linear-gradient(135deg, #ef4444, #f97316);
  border-radius: 50%;
  z-index: -1;
  opacity: 0.1;
}

.no-rooms-content {
  text-align: center;
}

.no-rooms-title {
  font-size: 2rem;
  font-weight: 800;
  color: #111827;
  margin: 0 0 0.5rem;
  letter-spacing: -0.025em;
}

.no-rooms-subtitle {
  font-size: 1.125rem;
  color: #6b7280;
  margin: 0 0 2rem;
  line-height: 1.6;
}

.no-rooms-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

.modify-search-btn {
  background: #111827;
  color: white;
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 12px rgba(17, 24, 39, 0.15);
}

.modify-search-btn:hover {
  background: #374151;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(17, 24, 39, 0.25);
}

.refresh-btn {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.refresh-btn:hover {
  background: #e5e7eb;
  border-color: #9ca3af;
  transform: translateY(-2px);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .no-rooms-container {
    padding: 2rem 1.5rem;
    margin: 1rem;
  }
  
  .no-rooms-title {
    font-size: 1.5rem;
  }
  
  .no-rooms-subtitle {
    font-size: 1rem;
  }
  
  .no-rooms-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .modify-search-btn,
  .refresh-btn {
    width: 100%;
    max-width: 200px;
    justify-content: center;
  }
}
</style>
