// Production backend URL
const PRODUCTION_API_URL = "https://server-sepia-phi-35.vercel.app";

// Use production URL in production, localhost for development
const isProduction =
  window.location.hostname !== "localhost" &&
  window.location.hostname !== "127.0.0.1";

const API_URL = isProduction
  ? PRODUCTION_API_URL
  : import.meta.env.VITE_API_URL || "http://localhost:5000";

export default API_URL;
