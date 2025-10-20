# VenueHub – Entertainment & Venue Booking MVP

A modern, mobile‑ready entertainment/venue hub:
- **Backend:** FastAPI + SQLAlchemy (PostgreSQL via `DATABASE_URL`)
- **Frontend:** React (Vite) + Tailwind CSS
- **Auth:** JWT (admin panel + CRUD for Acts/Venues/Bookings)
- **Deploy:** Railway (Nixpacks), Vercel/Netlify optional for frontend
- **Seed:** Dummy data + initial admin user

## Quick Start

### 1) Backend (Railway)
1. Create a new Railway service and add a PostgreSQL database plugin.
2. Set environment variables on Railway for the backend service:
   - `DATABASE_URL` (from Railway Postgres)
   - `SECRET_KEY` (any long random string)
   - Optionally: `SEED=1` to seed dummy data on first boot
3. Deploy this repo (or `backend` subfolder as its own service).
4. Railway will run `web: uvicorn app.main:app --host 0.0.0.0 --port 8080` via the `Procfile`.

### 2) Frontend
- Local dev:
  ```bash
  cd frontend
  npm install
  npm run dev
  ```
- Build for production:
  ```bash
  npm run build
  npm run preview
  ```
- Set `VITE_API_BASE` in `frontend/.env` (e.g. your Railway backend URL).

### Admin Login
- Default admin (if `SEED=1` on first boot):
  - Email: `admin@venuehub.local`
  - Password: `admin123`

### API Summary
- Public:
  - `GET /api/acts`, `GET /api/acts/{id}`
  - `GET /api/venues`, `GET /api/venues/{id}`
  - `POST /api/bookings` (create an enquiry/booking)
- Auth (admin):
  - `POST /api/auth/login`
  - `GET/POST/PUT/DELETE /api/admin/acts`
  - `GET/POST/PUT/DELETE /api/admin/venues`
  - `GET/PUT/DELETE /api/admin/bookings`

### Notes
- This is an MVP: simple but complete booking flow, admin CRUD, seeded content, responsive UI.
- Swap out the design copy/images as you like.
