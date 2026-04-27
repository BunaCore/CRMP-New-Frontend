import { useEffect, useState } from "react";

/**
 * Debounce a value by a given delay.
 * @param value - The value to debounce.
 * @param delay - Delay in milliseconds (default 300ms).
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
