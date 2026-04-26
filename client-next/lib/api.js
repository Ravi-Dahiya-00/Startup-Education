// Production backend URL
const PRODUCTION_API_URL = "https://server-sepia-phi-35.vercel.app";

// For Next.js, use environment variable or detect environment
const getApiUrl = () => {
  // Server-side: always use the env variable or production URL
  if (typeof window === "undefined") {
    return process.env.NEXT_PUBLIC_API_URL || PRODUCTION_API_URL;
  }

  // Client-side: check hostname
  const isProduction =
    window.location.hostname !== "localhost" &&
    window.location.hostname !== "127.0.0.1";

  return isProduction
    ? PRODUCTION_API_URL
    : process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
};

const API_URL = getApiUrl();
export default API_URL;
