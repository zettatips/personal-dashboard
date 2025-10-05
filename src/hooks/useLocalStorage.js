import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
  const [state, setState] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
      console.log('Saved to localStorage:', key, state);
    } catch (error) {
      console.error('Error writing to localStorage:', error);
      if (error.name === 'QuotaExceededError') {
        alert('Storage quota exceeded. Please export and clear old data.');
      }
    }
  }, [key, state]);

  const clearState = () => {
    window.localStorage.removeItem(key);
    setState(initialValue);
  };

  return [state, setState, clearState];
}
