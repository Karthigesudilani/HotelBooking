<script setup>
import { ref, onMounted } from 'vue'
import { login, isLoading, isLoggedIn, currentUser } from '../state/auth.js'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')
const alreadyLoggedIn = ref(false)

onMounted(() => {
  // Check if user is already logged in
  console.log('Login page mounted - isLoggedIn:', isLoggedIn.value)
  
  if (isLoggedIn.value) {
    alreadyLoggedIn.value = true
    console.log('User is logged in, redirecting to dashboard')
    // Show message and redirect after a short delay
    setTimeout(() => {
      console.log('Attempting to navigate to dashboard...')
      router.replace('/dashboard')
    }, 1000)
  }
})

async function handleLogin() {
  error.value = ''
  try {
    await login(email.value, password.value)
    router.push({ name: 'Dashboard' })
  } catch (err) {
    error.value = err.message || 'Login failed'
  }
}
</script>

<template>
  <div class="login-page">
    <!-- Already Logged In Message -->
    <div v-if="alreadyLoggedIn" class="already-logged-in">
      <div class="message-container">
        <div class="message-icon">✓</div>
        <h2>You are already logged in!</h2>
        <p>Redirecting you to your dashboard...</p>
        <div class="loading-spinner"></div>
      </div>
    </div>
    
    <!-- Login Form -->
    <div v-else class="login-container">
      <!-- Login Form Card -->
      <div class="login-card">
        <div class="card-header">
          <h1>Sign In</h1>
          <p>Welcome back! Please sign in to continue.</p>
        </div>
        
        <form class="login-form" @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="email">Email Address</label>
            <input 
              id="email" 
              type="email" 
              v-model="email" 
              placeholder="Enter your email"
              required 
            />
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input 
              id="password" 
              type="password" 
              v-model="password" 
              placeholder="Enter your password"
              required 
            />
          </div>
          
          <div v-if="error" class="error-message">{{ error }}</div>
          
          <button type="submit" :disabled="isLoading" class="login-btn">
            <span v-if="isLoading" class="loading-spinner"></span>
            {{ isLoading ? 'Signing In...' : 'Sign In' }}
          </button>
        </form>
        
        <div class="card-footer">
          <p>Don't have an account? <router-link to="/register" class="register-link">Create Account</router-link></p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
}

/* Already Logged In Message */
.already-logged-in {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.message-container {
  background: white;
  border-radius: 20px;
  padding: 3rem;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
}

.message-icon {
  width: 80px;
  height: 80px;
  background: #111827;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
  margin: 0 auto 1.5rem;
  font-weight: 700;
}

.message-container h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 1rem;
}

.message-container p {
  font-size: 1rem;
  color: #6b7280;
  margin: 0 0 2rem;
}

.message-container .loading-spinner {
  width: 30px;
  height: 30px;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #111827;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Main Login Container */
.login-container {
  max-width: 450px;
  width: 100%;
}

/* Login Card */
.login-card {
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.card-header {
  text-align: center;
  margin-bottom: 2rem;
}

.card-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.5rem;
}

.card-header p {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

/* Form Styles */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.form-group input {
  width: 100%;
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  background: #fafafa;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #111827;
  background: white;
  box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.1);
}

.form-group input::placeholder {
  color: #9ca3af;
}

.error-message {
  color: #dc2626;
  font-size: 0.875rem;
  padding: 0.75rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  margin-bottom: 0.5rem;
}

.login-btn {
  background: #111827;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(17, 24, 39, 0.3);
  background: #374151;
}

.login-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.card-footer {
  text-align: center;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.card-footer p {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
}

.register-link {
  color: #111827;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.register-link:hover {
  color: #374151;
  text-decoration: underline;
}

/* Responsive Design */
@media (max-width: 768px) {
  .login-page {
    padding: 1rem;
  }
  
  .login-container {
    max-width: 400px;
  }
  
  .login-card {
    padding: 2rem;
  }
  
  .card-header h1 {
    font-size: 1.75rem;
  }
}

@media (max-width: 480px) {
  .login-card {
    padding: 1.5rem;
  }
  
  .form-group input {
    padding: 0.875rem;
  }
  
  .login-btn {
    padding: 0.875rem 1.5rem;
  }
}
</style>


