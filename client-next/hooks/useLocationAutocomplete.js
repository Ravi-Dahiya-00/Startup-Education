"use client";

import { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';

/**
 * Custom hook for location autocomplete using LocationIQ API
 * Free tier: 5000 requests/day
 * Docs: https://locationiq.com/docs
 */

const LOCATIONIQ_API_KEY = process.env.NEXT_PUBLIC_LOCATIONIQ_API_KEY;
const LOCATIONIQ_ENDPOINT = 'https://api.locationiq.com/v1/autocomplete.php';

export const useLocationAutocomplete = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debounced search function to avoid too many API calls
  const searchLocations = useCallback(
    debounce(async (searchQuery) => {
      if (!searchQuery || searchQuery.length < 2) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          key: LOCATIONIQ_API_KEY,
          q: searchQuery,
          countrycodes: 'in', // Restrict to India
          limit: 20,
          format: 'json',
          dedupe: 1 // Remove duplicates
        });

        const response = await fetch(`${LOCATIONIQ_ENDPOINT}?${params}`);
        
        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        
        // Format the suggestions
        const formattedSuggestions = data.map(location => ({
          displayName: location.display_name,
          city: location.address?.city || location.address?.town || location.address?.village,
          state: location.address?.state,
          country: location.address?.country,
          lat: location.lat,
          lon: location.lon,
          type: location.type,
          importance: location.importance
        }));

        setSuggestions(formattedSuggestions);
      } catch (err) {
        console.error('Location search error:', err);
        setError(err.message);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300), // 300ms debounce
    []
  );

  useEffect(() => {
    searchLocations(query);
  }, [query, searchLocations]);

  const clearSuggestions = () => {
    setSuggestions([]);
    setQuery('');
  };

  return {
    query,
    setQuery,
    suggestions,
    loading,
    error,
    clearSuggestions
  };
};

// Alternative: Mapbox Geocoding API (if you have API key)
export const useMapboxAutocomplete = () => {
  const MAPBOX_TOKEN = 'YOUR_MAPBOX_TOKEN_HERE';
  const MAPBOX_ENDPOINT = 'https://api.mapbox.com/geocoding/v5/mapbox.places';

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchLocations = useCallback(
    debounce(async (searchQuery) => {
      if (!searchQuery || searchQuery.length < 2) {
        setSuggestions([]);
        return;
      }

      setLoading(true);

      try {
        const url = `${MAPBOX_ENDPOINT}/${encodeURIComponent(searchQuery)}.json?access_token=${MAPBOX_TOKEN}&country=IN&types=place,locality&limit=20`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        const formattedSuggestions = data.features.map(feature => ({
          displayName: feature.place_name,
          city: feature.text,
          coordinates: feature.geometry.coordinates,
          type: feature.place_type[0]
        }));

        setSuggestions(formattedSuggestions);
      } catch (err) {
        console.error('Mapbox error:', err);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    searchLocations(query);
  }, [query, searchLocations]);

  return {
    query,
    setQuery,
    suggestions,
    loading,
    clearSuggestions: () => {
      setSuggestions([]);
      setQuery('');
    }
  };
};

export default useLocationAutocomplete;
