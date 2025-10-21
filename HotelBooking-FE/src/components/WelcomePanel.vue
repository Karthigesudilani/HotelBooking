<script setup>
const props = defineProps({
  title: {
    type: String,
    default: 'Welcome to BookMyRooms'
  },
  description: {
    type: String,
    default: 'Join thousands of travelers who trust us for their accommodation needs. Create your account and unlock exclusive benefits.'
  },
  icon: {
    type: String,
    default: '🏨'
  },
  benefits: {
    type: Array,
    default: () => [
      'Exclusive member rates',
      'Priority booking support',
      'Easy booking management',
      '24/7 customer service'
    ]
  }
})
</script>

<template>
  <div class="welcome-panel">
    <div class="welcome-content">
      <div class="welcome-icon">{{ icon }}</div>
      <h2>{{ title }}</h2>
      <p class="welcome-text">
        {{ description }}
      </p>
      
      <div class="benefits-list">
        <div 
          v-for="(benefit, index) in benefits" 
          :key="index" 
          class="benefit-item"
        >
          <div class="benefit-icon">✓</div>
          <span>{{ benefit }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Right Panel: Welcome Content */
.welcome-panel {
  background: #111827;
  padding: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  position: relative;
  overflow: hidden;
}

.welcome-content {
  text-align: center;
}

.welcome-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
}

.welcome-content h2 {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 1rem;
  color: white;
}

.welcome-text {
  font-size: 1rem;
  line-height: 1.6;
  color: #d1d5db;
  margin: 0 0 2.5rem;
  width: 100%;
  text-align: center;
}

.benefits-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: left;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.benefit-icon {
  width: 24px;
  height: 24px;
  background: #374151;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
}

.benefit-item span {
  font-size: 0.875rem;
  color: #e5e7eb;
  font-weight: 500;
}

/* Responsive Design */
@media (max-width: 768px) {
  .welcome-panel {
    padding: 2rem;
  }
  
  .welcome-content h2 {
    font-size: 1.5rem;
  }
  
  .welcome-icon {
    font-size: 3rem;
  }
  
  .welcome-text {
    width: 100%;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .welcome-panel {
    padding: 1.5rem;
  }
}
</style>
