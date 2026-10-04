// Backend API base URL. Set VITE_API_BASE in a .env file (or in Vercel's project env vars)
// to point at the deployed backend. Falls back to localhost for local development.
export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

// External SumUp booking page — every "Book Now" button site-wide links here instead of
// the internal /book flow. The internal booking system (BookNow.tsx) is kept but unlinked.
export const BOOKING_URL = 'https://sumupbookings.com/sakina-massage-974-conciergerie';
