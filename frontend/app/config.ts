// frontend/app/config.ts

const isProd = process.env.NODE_ENV === 'production';

// This is your REAL live backend URL from Render
export const API_URL = isProd 
  ? 'https://nexus-tools-3.onrender.com' 
  : 'http://localhost:8000';