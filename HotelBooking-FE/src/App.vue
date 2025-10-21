<script setup>
import { isLoggedIn, logout } from './state/auth.js'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

async function handleLogout() {
  await logout()
  router.push('/login')
}

// Define steps and their corresponding routes
const steps = [
  { id: 1, name: 'SEARCH', route: '/' },
  { id: 2, name: 'SELECT ROOM', route: '/rooms' },
  { id: 3, name: 'CONTACT INFORMATION', route: '/contact' },
  { id: 4, name: 'CONFIRMATION', route: '/confirmation' }
]

// Get current step based on route
const getCurrentStep = () => {
  const currentPath = route.path
  if (currentPath === '/') return 1
  if (currentPath === '/rooms') return 2
  if (currentPath === '/contact') return 3
  if (currentPath === '/confirmation') return 4
  return 1
}

// Check if current route should show step indicator
const shouldShowStepIndicator = () => {
  const currentPath = route.path
  const bookingFlowRoutes = ['/', '/rooms', '/contact', '/confirmation']
  return bookingFlowRoutes.includes(currentPath)
}
</script>

<template>
  <div class="layout">
    <header class="masthead">
      <div class="brand">
        <RouterLink to="/" class="brand-link">
          <span class="hotel">BookMyRooms</span>
        </RouterLink>
      </div>
      <nav class="nav">
        <RouterLink to="/">Rooms</RouterLink>
        <template v-if="!isLoggedIn">
          <RouterLink to="/login">Login</RouterLink>
          <RouterLink to="/register">Register</RouterLink>
        </template>
        <template v-else>
          <RouterLink to="/dashboard">Dashboard</RouterLink>
          <button class="linklike" @click="handleLogout">Logout</button>
        </template>
      </nav>
    </header>
    
    <!-- Step Indicator - Only show for booking flow pages -->
    <div v-if="shouldShowStepIndicator()" class="step-indicator">
      <div class="steps">
        <div 
          v-for="step in steps" 
          :key="step.id" 
          :class="['step', { active: getCurrentStep() === step.id, completed: getCurrentStep() > step.id }]"
        >
          <div class="step-number">{{ step.id }}</div>
          <div class="step-name">{{ step.name }}</div>
        </div>
      </div>
    </div>
    
    <main class="content">
      <RouterView />
    </main>
    <footer class="footer">© {{ new Date().getFullYear() }} BookMyRooms</footer>
  </div>
  
</template>

<style scoped>
.layout {
  min-height: 100vh;
  display: grid;
  grid-template-rows: auto auto 1fr auto;
}
.masthead {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  background: #ffffffcc;
  backdrop-filter: blur(6px);
}
.brand-link {
  text-decoration: none;
  color: inherit;
  transition: opacity 0.2s ease;
}

.brand-link:hover {
  opacity: 0.8;
}

.brand .hotel {
  font-weight: 700;
  letter-spacing: 0.2px;
}
.nav {
  display: flex;
  gap: 0.75rem;
}
.nav a {
  text-decoration: none;
  color: #1f2937;
  padding: 0.4rem 0.6rem;
  border-radius: 6px;
}
.nav a.router-link-active {
  background: #f3f4f6;
}
.step-indicator {
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  padding: 1.5rem 1rem;
}
.steps {
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 1000px;
  margin: 0 auto;
  gap: 2rem;
}
.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  position: relative;
  flex: 1;
}
.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e5e7eb;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
  transition: all 0.3s ease;
}
.step-name {
  font-size: 0.75rem;
  color: #6b7280;
  text-align: center;
  font-weight: 600;
  letter-spacing: 0.5px;
}
.step.active .step-number {
  background: #111827;
  color: white;
}
.step.active .step-name {
  color: #111827;
  font-weight: 700;
}
.step.completed .step-number {
  background: #111827;
  color: white;
}
.step.completed .step-name {
  color: #111827;
  font-weight: 700;
}
.step:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 20px;
  left: calc(50% + 20px);
  width: calc(100% - 40px);
  height: 2px;
  background: #e5e7eb;
  z-index: -1;
}
.step.completed:not(:last-child)::after {
  background: #111827;
}
.content {
  padding: 1rem;
}
.footer {
  font-size: 0.875rem;
  color: #6b7280;
  padding: 1rem;
  text-align: center;
  border-top: 1px solid #e5e7eb;
}
</style>
