import Cookies from "js-cookie";
import { useEffect, useState } from "react";

export const getCookie = (name: string) => Cookies.get(name);

// Set cookie with sane defaults: persistent for 7 days and path '/'
export const setCookie = (name: string, value: string) =>
  Cookies.set(name, value, { expires: 7, path: "/" });

export const removeCookie = (name: string) => Cookies.remove(name, { path: "/" });

// useDebounce helper (kept here for convenience)
export function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
