import { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import { ALL_SKILLS } from '../data/skills';

/**
 * Skills Autocomplete using Hybrid Approach:
 * 1. GitHub Topics API for tech skills
 * 2. Local database for soft skills
 * 3. Fuzzy matching for better search
 */

const GITHUB_TOPICS_API = 'https://api.github.com/search/topics';

export const useSkillsAutocomplete = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fuzzy search in local database
  const fuzzySearchLocal = (searchQuery) => {
    const lowerQuery = searchQuery.toLowerCase();
    
    return ALL_SKILLS
      .filter(skill => {
        const lowerSkill = skill.toLowerCase();
        // Exact match or starts with
        if (lowerSkill.includes(lowerQuery)) return true;
        
        // Fuzzy match - allows for typos
        const words = lowerQuery.split(' ');
        return words.every(word => lowerSkill.includes(word));
      })
      .slice(0, 15); // Limit to 15 from local DB
  };

  // Search GitHub Topics for tech skills
  const searchGitHubTopics = async (searchQuery) => {
    try {
      const response = await fetch(
        `${GITHUB_TOPICS_API}?q=${encodeURIComponent(searchQuery)}&per_page=10`,
        {
          headers: {
            'Accept': 'application/vnd.github.mercy-preview+json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('GitHub API error');
      }

      const data = await response.json();
      return data.items.map(item => ({
        name: item.name,
        displayName: item.display_name || item.name,
        description: item.short_description,
        source: 'github',
        featured: item.featured || false
      }));
    } catch (err) {
      console.error('GitHub Topics error:', err);
      return [];
    }
  };

  // Combined search function
  const searchSkills = useCallback(
    debounce(async (searchQuery) => {
      if (!searchQuery || searchQuery.length < 2) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Search both sources in parallel
        const [githubResults, localResults] = await Promise.all([
          searchGitHubTopics(searchQuery),
          Promise.resolve(fuzzySearchLocal(searchQuery))
        ]);

        // Combine and deduplicate results
        const githubSkills = githubResults.map(r => ({
          name: r.displayName,
          source: 'github',
          description: r.description
        }));

        const localSkills = localResults.map(skill => ({
          name: skill,
          source: 'local',
          description: null
        }));

        // Merge, prioritize GitHub for tech terms, deduplicate
        const combined = [...githubSkills, ...localSkills];
        const uniqueSkills = Array.from(
          new Map(combined.map(s => [s.name.toLowerCase(), s])).values()
        );

        setSuggestions(uniqueSkills.slice(0, 20)); // Max 20 suggestions
      } catch (err) {
        console.error('Skills search error:', err);
        setError(err.message);
        // Fallback to local search only
        setSuggestions(fuzzySearchLocal(searchQuery).map(skill => ({
          name: skill,
          source: 'local',
          description: null
        })));
      } finally {
        setLoading(false);
      }
    }, 300), // 300ms debounce
    []
  );

  useEffect(() => {
    searchSkills(query);
  }, [query, searchSkills]);

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

// Alternative: ESCO API (European Skills)
export const useESCOSkills = () => {
  const ESCO_API = 'https://ec.europa.eu/esco/api/search';
  
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchESCO = useCallback(
    debounce(async (searchQuery) => {
      if (!searchQuery || searchQuery.length < 2) {
        setSuggestions([]);
        return;
      }

      setLoading(true);

      try {
        const response = await fetch(
          `${ESCO_API}?text=${encodeURIComponent(searchQuery)}&type=skill&language=en&limit=20`
        );

        const data = await response.json();
        
        const skills = data._embedded?.results?.map(result => ({
          name: result.title,
          description: result.description,
          uri: result.uri,
          source: 'esco'
        })) || [];

        setSuggestions(skills);
      } catch (err) {
        console.error('ESCO API error:', err);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    searchESCO(query);
  }, [query, searchESCO]);

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

export default useSkillsAutocomplete;
