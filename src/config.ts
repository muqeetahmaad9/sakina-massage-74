// Backend API base URL. Set VITE_API_BASE in a .env file (or in Vercel's project env vars)
// to point at the deployed backend. Falls back to localhost for local development.
export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';
