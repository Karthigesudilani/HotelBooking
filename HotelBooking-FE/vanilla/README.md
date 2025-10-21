# HotelBooking-FE (Vanilla JS)

A no-framework implementation using plain HTML/CSS/JS with a simple hash router and localStorage-backed auth.

## Run locally
- Open `vanilla/index.html` directly in your browser, or
- Serve the folder (any static server):

```bash
cd vanilla
python3 -m http.server 8080
# then open http://localhost:8080
```

## Features
- Hash routes: `#/`, `#/rooms`, `#/contact`, `#/confirmation`, `#/login`, `#/register`, `#/dashboard`
- Auth token stored in `localStorage` (`hb_token`)
- Navbar shows Login/Register when logged out; Dashboard/Logout when logged in
- Placeholder flows for booking and cancellation
