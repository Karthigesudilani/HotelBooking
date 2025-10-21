// Simple auth state backed by localStorage
const auth = {
  get token() { return localStorage.getItem('hb_token') || '' },
  set token(v) { 
    v ? localStorage.setItem('hb_token', v) : localStorage.removeItem('hb_token')
    apiService.setToken(v)
  }
}

// Import API service
import apiService from './api.js'

// Views
const views = {
  search() {
    return `
      <section>
        <h1>Find your stay</h1>
        <form class="grid" id="search-form">
          <label>Destination<input name="destination" placeholder="City or Hotel" /></label>
          <label>Check-in<input name="checkIn" type="date" /></label>
          <label>Check-out<input name="checkOut" type="date" /></label>
          <label>Guests<input name="guests" type="number" min="1" value="1" /></label>
          <button type="submit">Search</button>
        </form>
      </section>
    `
  },
  async rooms() {
    // Check if we have search parameters in URL
    const urlParams = new URLSearchParams(location.search)
    const hasParams = urlParams.get('destination') || urlParams.get('check_in') || urlParams.get('check_out') || urlParams.get('guests')
    
    // Format search criteria for display
    const getSearchCriteria = () => {
      if (!hasParams) return []
      const criteria = []
      if (urlParams.get('destination')) criteria.push(`Destination: ${urlParams.get('destination')}`)
      if (urlParams.get('check_in')) criteria.push(`Check-in: ${urlParams.get('check_in')}`)
      if (urlParams.get('check_out')) criteria.push(`Check-out: ${urlParams.get('check_out')}`)
      if (urlParams.get('guests')) criteria.push(`Guests: ${urlParams.get('guests')}`)
      return criteria
    }
    
    if (!hasParams) {
      return `
        <section>
          <h1>Available rooms</h1>
          <div class="no-search">
            <p>Please search for rooms first to see available options.</p>
            <a href="#/" class="search-link">Go to Room Search</a>
          </div>
        </section>
      `
    }
    
    try {
      const params = {
        destination: urlParams.get('destination'),
        check_in: urlParams.get('check_in'),
        check_out: urlParams.get('check_out'),
        guests: urlParams.get('guests')
      }
      const response = await apiService.searchRooms(params)
      const rooms = response.data || []
      const criteria = getSearchCriteria()
      
      if (rooms.length === 0) {
        return `
          <section>
            <h1>Available rooms</h1>
            ${criteria.length > 0 ? `
              <div class="search-criteria">
                <h3>Your search:</h3>
                <div class="criteria-list">
                  ${criteria.map(c => `<span class="criterion">${c}</span>`).join('')}
                </div>
              </div>
            ` : ''}
            <div class="no-rooms">
              <p>No rooms available for your search criteria.</p>
            </div>
          </section>
        `
      }
      
      return `
        <section>
          <h1>Available rooms</h1>
          <div class="search-criteria">
            <h3>Your search:</h3>
            <div class="criteria-list">
              ${criteria.map(c => `<span class="criterion">${c}</span>`).join('')}
            </div>
          </div>
          <div class="grid-cards">
            ${rooms.map(r => `
              <article class="card">
                <h2>${r.room_name}</h2>
                <p>${r.number_of_guests} guest(s)</p>
                <p><strong>$${r.price_per_night}</strong>/night</p>
                <a href="#/confirmation?room_id=${r.id}" class="book">Book</a>
              </article>
            `).join('')}
          </div>
        </section>
      `
    } catch (error) {
      return `
        <section>
          <h1>Available rooms</h1>
          <div class="error">Failed to load rooms: ${error.message}</div>
        </section>
      `
    }
  },
  contact() {
    return `
      <section>
        <h1>Contact us</h1>
        <form class="grid" id="contact-form">
          <label>Name<input name="name" /></label>
          <label>Email<input name="email" type="email" /></label>
          <label>Message<textarea name="message" rows="4"></textarea></label>
          <button type="submit">Send</button>
        </form>
      </section>
    `
  },
  confirmation() {
    return `
      <section>
        <h1>Booking confirmed</h1>
        <p>Your confirmation code is <strong>HB123456</strong>.</p>
        <ul>
          <li>Hotel: Seaview Hotel</li>
          <li>Room: Deluxe Room</li>
          <li>Check-in: 2025-11-01</li>
          <li>Check-out: 2025-11-05</li>
        </ul>
      </section>
    `
  },
  login() {
    return `
      <section>
        <h1>Login</h1>
        <form class="grid" id="login-form">
          <label>Email<input name="email" type="email" required /></label>
          <label>Password<input name="password" type="password" required /></label>
          <button type="submit">Login</button>
        </form>
      </section>
    `
  },
  register() {
    return `
      <section>
        <h1>Register</h1>
        <form class="grid" id="register-form">
          <label>Name<input name="name" required /></label>
          <label>Email<input name="email" type="email" required /></label>
          <label>Password<input name="password" type="password" required /></label>
          <button type="submit">Create account</button>
        </form>
      </section>
    `
  },
  async dashboard() {
    if (!auth.token) {
      return `
        <section>
          <h1>My bookings</h1>
          <p>Please <a href="#/login">login</a> to view your bookings.</p>
        </section>
      `
    }
    
    try {
      const response = await apiService.getBookings()
      const bookings = response.data || []
      const upcoming = bookings.filter(b => new Date(b.check_out) >= new Date())
      const past = bookings.filter(b => new Date(b.check_out) < new Date())
      
      return `
        <section>
          <h1>My bookings</h1>
          <div class="grid-cards" style="grid-template-columns: 1fr 1fr;">
            <div>
              <h2>Upcoming</h2>
              <ul>
                ${upcoming.map(b => `
                  <li>
                    ${b.id} — ${b.room?.room_name} — ${b.check_in} → ${b.check_out}
                    ${b.status !== 'cancelled' ? `<button class="danger" data-cancel="${b.id}">Cancel</button>` : ''}
                  </li>
                `).join('')}
              </ul>
            </div>
            <div>
              <h2>Past</h2>
              <ul>
                ${past.map(b => `<li>${b.id} — ${b.room?.room_name} — ${b.check_in} → ${b.check_out}</li>`).join('')}
              </ul>
            </div>
          </div>
        </section>
      `
    } catch (error) {
      return `
        <section>
          <h1>My bookings</h1>
          <div class="error">Failed to load bookings: ${error.message}</div>
        </section>
      `
    }
  }
}

// Router
const routes = {
  '': 'search',
  '#/': 'search',
  '#/rooms': 'rooms',
  '#/contact': 'contact',
  '#/confirmation': 'confirmation',
  '#/login': 'login',
  '#/register': 'register',
  '#/dashboard': 'dashboard'
}

function renderNav() {
  const nav = document.getElementById('nav')
  const loggedIn = !!auth.token
  nav.innerHTML = `
    <a href="#/" data-home>Room Search</a>
    <a href="#/rooms">Rooms</a>
    <a href="#/contact">Contact</a>
    <a href="#/confirmation">Confirmation</a>
    ${loggedIn ? `
      <a href="#/dashboard">Dashboard</a>
      <button class="linklike" id="logout-btn">Logout</button>
    ` : `
      <a href="#/login">Login</a>
      <a href="#/register">Register</a>
    `}
  `
  const btn = document.getElementById('logout-btn')
  if (btn) btn.addEventListener('click', logout)
  // Active link
  Array.from(nav.querySelectorAll('a')).forEach(a => {
    if (a.getAttribute('href') === location.hash || (location.hash === '' && a.getAttribute('href') === '#/')) {
      a.classList.add('active')
    }
  })
}

function navigate(hash) { if (hash) location.hash = hash; else onRouteChange() }

async function onRouteChange() {
  const view = document.getElementById('view')
  const routeKey = routes[location.hash] || 'search'
  // Gate dashboard for logged-in only
  if (routeKey === 'dashboard' && !auth.token) { return navigate('#/login') }
  
  // Handle async views
  if (typeof views[routeKey] === 'function' && views[routeKey].constructor.name === 'AsyncFunction') {
    view.innerHTML = 'Loading...'
    view.innerHTML = await views[routeKey]()
  } else {
    view.innerHTML = views[routeKey]()
  }
  
  wireActions(routeKey)
  renderNav()
}

function wireActions(routeKey) {
  if (routeKey === 'search') {
    const form = document.getElementById('search-form')
    form?.addEventListener('submit', (e) => { 
      e.preventDefault()
      const formData = new FormData(form)
      const params = new URLSearchParams({
        destination: formData.get('destination') || '',
        check_in: formData.get('checkIn') || '',
        check_out: formData.get('checkOut') || '',
        guests: formData.get('guests') || '1'
      })
      navigate(`#/rooms?${params.toString()}`)
    })
  }
  if (routeKey === 'contact') {
    const form = document.getElementById('contact-form')
    form?.addEventListener('submit', (e) => { e.preventDefault(); alert('Message sent!') })
  }
  if (routeKey === 'login') {
    const form = document.getElementById('login-form')
    form?.addEventListener('submit', async (e) => { 
      e.preventDefault()
      const formData = new FormData(form)
      try {
        const response = await apiService.login(formData.get('email'), formData.get('password'))
        auth.token = response.token
        navigate('#/dashboard')
      } catch (error) {
        alert('Login failed: ' + error.message)
      }
    })
  }
  if (routeKey === 'register') {
    const form = document.getElementById('register-form')
    form?.addEventListener('submit', async (e) => { 
      e.preventDefault()
      const formData = new FormData(form)
      try {
        const response = await apiService.register(formData.get('name'), formData.get('email'), formData.get('password'))
        auth.token = response.token
        navigate('#/dashboard')
      } catch (error) {
        alert('Registration failed: ' + error.message)
      }
    })
  }
  if (routeKey === 'dashboard') {
    document.querySelectorAll('[data-cancel]')?.forEach(el => {
      el.addEventListener('click', async () => { 
        if (confirm('Are you sure you want to cancel this booking?')) {
          try {
            await apiService.cancelBooking(el.dataset.cancel)
            alert('Booking cancelled successfully')
            navigate('#/dashboard') // Refresh
          } catch (error) {
            alert('Failed to cancel booking: ' + error.message)
          }
        }
      })
    })
  }
}

// Init
document.getElementById('year').textContent = new Date().getFullYear().toString()
window.addEventListener('hashchange', onRouteChange)
onRouteChange()

function logout() {
  auth.token = ''
  navigate('#/')
}


