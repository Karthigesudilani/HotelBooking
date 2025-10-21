<script setup>
// No props needed for this component as it's static
</script>

<template>
  <div class="dashboard-header">
    <div class="header-background">
      <div class="bg-pattern"></div>
      <div class="bg-gradient"></div>
    </div>
    <div class="header-content">
      <div class="welcome-section">
        <div class="welcome-badge">
          <span class="badge-icon">👋</span>
          <span>Welcome back!</span>
        </div>
        <h1>Your Dashboard</h1>
        <p>Manage your bookings and reservations with ease</p>
      </div>
      <div class="header-actions">
        <router-link to="/" class="book-btn">
          <span class="btn-icon">+</span>
          <span class="btn-text">Book New Room</span>
          <div class="btn-shine"></div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Header Section */
.dashboard-header {
  position: relative;
  background: linear-gradient(135deg, #111827 0%, #374151 50%, #1f2937 100%);
  color: white;
  padding: 1.5rem 2rem;
  margin-bottom: 1rem;
  overflow: hidden;
}

.header-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

.bg-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23dots)"/></svg>');
  animation: float 20s ease-in-out infinite;
}

.bg-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 70% 80%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(1deg); }
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 2;
}

.welcome-section {
  flex: 1;
}

.welcome-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 16px;
  font-size: 0.75rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.badge-icon {
  font-size: 1rem;
}

.welcome-section h1 {
  font-size: 2rem;
  font-weight: 800;
  margin: 0 0 0.25rem;
  color: white;
  background: linear-gradient(135deg, #ffffff 0%, #e5e7eb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.1;
}

.welcome-section p {
  font-size: 0.875rem;
  color: #d1d5db;
  margin: 0;
  font-weight: 400;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.book-btn {
  position: relative;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%);
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(20px);
  overflow: hidden;
  font-size: 0.875rem;
}

.book-btn:hover {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.1) 100%);
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.btn-icon {
  font-size: 1.5rem;
  font-weight: 700;
  transition: transform 0.3s ease;
}

.book-btn:hover .btn-icon {
  transform: rotate(90deg) scale(1.1);
}

.btn-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.6s ease;
}

.book-btn:hover .btn-shine {
  left: 100%;
}

/* Responsive Design */
@media (max-width: 768px) {
  .dashboard-header {
    padding: 3rem 1rem;
  }
  
  .header-content {
    flex-direction: column;
    gap: 2rem;
    text-align: center;
  }
  
  .welcome-section h1 {
    font-size: 2.5rem;
  }
}
</style>
