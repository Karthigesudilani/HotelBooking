<script setup>
import { ref, onMounted } from 'vue'
import { register, isLoading, isLoggedIn, currentUser } from '../state/auth.js'
import { useRouter } from 'vue-router'
import WelcomePanel from '../components/WelcomePanel.vue'

const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const alreadyLoggedIn = ref(false)
const passwordErrors = ref([])
const passwordStrength = ref(0)

onMounted(() => {
  // Check if user is already logged in
  console.log('Register page mounted - isLoggedIn:', isLoggedIn.value)
  
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

// Password validation functions
function validatePassword(password) {
  const errors = []
  let strength = 0
  
  // Length check
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  } else {
    strength += 1
  }
  
  // Uppercase check
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  } else {
    strength += 1
  }
  
  // Lowercase check
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  } else {
    strength += 1
  }
  
  // Number check
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  } else {
    strength += 1
  }
  
  // Special character check
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character')
  } else {
    strength += 1
  }
  
  return { errors, strength }
}

function checkPasswordMatch() {
  if (confirmPassword.value && password.value !== confirmPassword.value) {
    return 'Passwords do not match'
  }
  return null
}

function updatePasswordValidation() {
  if (password.value) {
    const validation = validatePassword(password.value)
    passwordErrors.value = validation.errors
    passwordStrength.value = validation.strength
  } else {
    passwordErrors.value = []
    passwordStrength.value = 0
  }
}

function getStrengthClass() {
  if (passwordStrength.value <= 2) return 'weak'
  if (passwordStrength.value <= 3) return 'medium'
  return 'strong'
}

function getStrengthText() {
  if (passwordStrength.value <= 2) return 'Weak'
  if (passwordStrength.value <= 3) return 'Medium'
  return 'Strong'
}

function getMetRequirements() {
  const requirements = []
  if (password.value.length >= 8) requirements.push('At least 8 characters')
  if (/[A-Z]/.test(password.value)) requirements.push('Contains uppercase letter')
  if (/[a-z]/.test(password.value)) requirements.push('Contains lowercase letter')
  if (/\d/.test(password.value)) requirements.push('Contains number')
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password.value)) requirements.push('Contains special character')
  return requirements
}

async function handleRegister() {
  error.value = ''
  
  // Validate password
  const passwordValidation = validatePassword(password.value)
  if (passwordValidation.errors.length > 0) {
    error.value = 'Please fix password requirements: ' + passwordValidation.errors.join(', ')
    return
  }
  
  // Check password match
  const matchError = checkPasswordMatch()
  if (matchError) {
    error.value = matchError
    return
  }
  
  try {
    await register(name.value, email.value, password.value)
    router.push({ name: 'Dashboard' })
  } catch (err) {
    error.value = err.message || 'Registration failed'
  }
}
</script>

<template>
  <div class="register-page">
    <!-- Already Logged In Message -->
    <div v-if="alreadyLoggedIn" class="already-logged-in">
      <div class="message-container">
        <div class="message-icon">✓</div>
        <h2>You are already logged in!</h2>
        <p>Redirecting you to your dashboard...</p>
        <div class="loading-spinner"></div>
      </div>
    </div>
    
    <!-- Registration Form -->
    <div v-else class="register-container">
      <!-- Left Panel: Registration Form -->
      <div class="register-form-panel">
        <div class="form-header">
          <h1>Create Account</h1>
          <p class="form-subtitle">Join BookMyRooms and start your journey</p>
        </div>
        
        <form class="register-form" @submit.prevent="handleRegister">
          <div class="form-group">
            <label for="name">Full Name</label>
            <input 
              id="name" 
              type="text" 
              v-model="name" 
              placeholder="Enter your full name"
              required 
            />
          </div>
          
          <div class="form-group">
            <label for="email">Email Address</label>
            <input 
              id="email" 
              type="email" 
              v-model="email" 
              placeholder="Enter your email address"
              required 
            />
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input 
              id="password" 
              type="password" 
              v-model="password" 
              @input="updatePasswordValidation"
              placeholder="Create a secure password"
              required 
            />
            
            <!-- Password Strength Indicator -->
            <div v-if="password" class="password-strength">
              <div class="strength-bar">
                <div 
                  :class="['strength-fill', getStrengthClass()]" 
                  :style="{ width: (passwordStrength * 20) + '%' }"
                ></div>
              </div>
              <span class="strength-text">{{ getStrengthText() }}</span>
            </div>
            
            <!-- Password Requirements -->
            <div v-if="password" class="password-requirements">
              <div 
                v-for="error in passwordErrors" 
                :key="error" 
                class="requirement-item error"
              >
                <span class="requirement-icon">✗</span>
                {{ error }}
              </div>
              <div 
                v-for="requirement in getMetRequirements()" 
                :key="requirement" 
                class="requirement-item success"
              >
                <span class="requirement-icon">✓</span>
                {{ requirement }}
              </div>
            </div>
          </div>
          
          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input 
              id="confirmPassword" 
              type="password" 
              v-model="confirmPassword" 
              placeholder="Confirm your password"
              required 
            />
            <div v-if="confirmPassword && password !== confirmPassword" class="password-match-error">
              <span class="error-icon">✗</span>
              Passwords do not match
            </div>
            <div v-if="confirmPassword && password === confirmPassword" class="password-match-success">
              <span class="success-icon">✓</span>
              Passwords match
            </div>
          </div>
          
          <div v-if="error" class="error-message">{{ error }}</div>
          
          <button type="submit" :disabled="isLoading" class="register-btn">
            <span v-if="isLoading" class="loading-spinner"></span>
            {{ isLoading ? 'Creating Account...' : 'Create Account' }}
          </button>
        </form>
        
        <div class="login-link">
          <p>Already have an account? <router-link to="/login" class="link">Sign in here</router-link></p>
        </div>
      </div>
      
      <!-- Right Panel: Welcome Content -->
      <WelcomePanel />
    </div>
  </div>
</template>

<style scoped>
.register-page {
  min-height: 100vh;
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

.register-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 1000px;
  width: 100%;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  min-height: 600px;
}

/* Left Panel: Registration Form */
.register-form-panel {
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.form-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.form-header h1 {
  font-size: 2.5rem;
  font-weight: 800;
  color: #111827;
  margin: 0 0 0.5rem;
  background: linear-gradient(135deg, #111827 0%, #374151 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.form-subtitle {
  font-size: 1rem;
  color: #6b7280;
  margin: 0;
}

.register-form {
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
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  background: #fafafa;
  transition: all 0.3s ease;
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

/* Password Validation Styles */
.password-strength {
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.strength-bar {
  flex: 1;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  transition: all 0.3s ease;
  border-radius: 2px;
}

.strength-fill.weak {
  background: #dc2626;
}

.strength-fill.medium {
  background: #f59e0b;
}

.strength-fill.strong {
  background: #10b981;
}

.strength-text {
  font-size: 0.75rem;
  font-weight: 600;
  min-width: 50px;
}

.strength-text:has(.weak) {
  color: #dc2626;
}

.strength-text:has(.medium) {
  color: #f59e0b;
}

.strength-text:has(.strong) {
  color: #10b981;
}

.password-requirements {
  margin-top: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.requirement-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.requirement-item.error {
  color: #dc2626;
}

.requirement-item.success {
  color: #10b981;
}

.requirement-icon {
  font-size: 0.875rem;
  font-weight: 700;
}

.password-match-error,
.password-match-success {
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.password-match-error {
  color: #dc2626;
}

.password-match-success {
  color: #10b981;
}

.error-icon,
.success-icon {
  font-size: 0.875rem;
  font-weight: 700;
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

.register-btn {
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

.register-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(17, 24, 39, 0.3);
  background: #374151;
}

.register-btn:disabled {
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

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.login-link {
  text-align: center;
  margin-top: 2rem;
}

.login-link p {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
}

.link {
  color: #111827;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.link:hover {
  color: #374151;
  text-decoration: underline;
}

/* Right Panel: Welcome Content - Moved to WelcomePanel component */

/* Responsive Design */
@media (max-width: 768px) {
  .register-page {
    padding: 1rem;
  }
  
  .register-container {
    grid-template-columns: 1fr;
    max-width: 500px;
    border-radius: 16px;
  }
  
  .register-form-panel {
    padding: 2rem;
  }
  
  .form-header h1 {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .register-form-panel {
    padding: 1.5rem;
  }
  
  .form-header h1 {
    font-size: 1.75rem;
  }
  
  .form-group input {
    padding: 0.875rem;
  }
  
  .register-btn {
    padding: 0.875rem 1.5rem;
  }
}
</style>
