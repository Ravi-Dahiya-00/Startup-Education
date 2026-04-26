"use client";

import { useState } from 'react';

export const useUserLocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const detectLocation = async () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Use OpenStreetMap (Nominatim) for free reverse geocoding
          // Note: This is free but has rate limits. For production, use Google Maps API.
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          
          // Extract city/state
          const city = data.address.city || data.address.town || data.address.village || data.address.state_district;
          const state = data.address.state;
          
          const detectedLocation = {
            latitude,
            longitude,
            city,
            state,
            displayName: city // Simple display name
          };

          setLocation(detectedLocation);
          setLoading(false);
          return detectedLocation;
        } catch (err) {
          setError('Failed to fetch address details');
          setLoading(false);
        }
      },
      (err) => {
        setError('Unable to retrieve your location');
        setLoading(false);
      }
    );
  };

  return { location, error, loading, detectLocation };
};
