<script setup>
import { getRoomImage } from '../utils/imageUtils.js'

const props = defineProps({
  room: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['book-room'])

function handleBookRoom() {
  emit('book-room', props.room.id)
}
</script>

<template>
  <div class="room-card">
    <div class="room-image">
      <img :src="getRoomImage(room)" :alt="room.room_name" />
    </div>
    
    <div class="room-content">
      <h3 class="room-title">{{ room.room_name }}</h3>
      <p class="room-description">{{ room.description || 'Comfortable accommodation for your stay' }}</p>
    </div>
    
    <div class="room-pricing">
      <div class="price-section">
        <div class="price-row">
          <span class="price">${{ room.price_per_night }}</span>
          <span class="price-unit">/night</span>
        </div>
        <div class="price-note">Excludes taxes and fees</div>
      </div>
      
      <button @click="handleBookRoom" class="book-btn">Book Now</button>
    </div>
  </div>
</template>

<style scoped>
.room-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(226, 232, 240, 0.5);
  transition: all 0.3s ease;
}

.room-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}

/* Room Image */
.room-image {
  height: 180px;
  overflow: hidden;
  position: relative;
}

.room-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.room-card:hover .room-image img {
  transform: scale(1.05);
}

/* Room Content */
.room-content {
  padding: 1.5rem;
}

.room-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.5rem;
}

.room-description {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.5;
  margin: 0;
}

/* Room Pricing */
.room-pricing {
  padding: 1rem 1.5rem;
  background: #f8fafc;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price-section {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.price-row {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
}

.price {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
}

.price-unit {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.price-note {
  font-size: 0.75rem;
  color: #9ca3af;
}

.book-btn {
  background: #111827;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.book-btn:hover {
  background: #374151;
}

/* Responsive Design */
@media (max-width: 768px) {
  .room-pricing {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style>
