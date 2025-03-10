
import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const updateMatches = () => setMatches(mediaQuery.matches);
    
    // Set initial value
    updateMatches();
    
    // Listen for changes
    mediaQuery.addEventListener('change', updateMatches);
    
    // Clean up listener
    return () => mediaQuery.removeEventListener('change', updateMatches);
  }, [query]);

  return matches;
}
