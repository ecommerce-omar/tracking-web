import Cookies from 'js-cookie';
import { APP_CONFIG } from '@/constants/app.constants';
import { LocalStorage } from '@/utils/storage';

/**
 * Enhanced cookie utilities with fallback to localStorage
 */

/**
 * Sets a cookie with fallback to localStorage
 */
export const setCookie = (
  name: string, 
  value: string | object, 
  days: number = APP_CONFIG.COOKIES.EXPIRATION_DAYS
): void => {
  const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
  
  try {
    Cookies.set(name, stringValue, { expires: days });
  } catch (error) {
    console.warn('Cookie setting failed, using localStorage:', error);
    LocalStorage.set(name, value, days * 24 * 60 * 60 * 1000); // Convert days to milliseconds
  }
};

/**
 * Gets a cookie value with fallback to localStorage
 */
export const getCookie = (name: string): string | null => {
  try {
    return Cookies.get(name) || LocalStorage.get<string>(name);
  } catch (error) {
    console.warn('Cookie reading failed:', error);
    return LocalStorage.get<string>(name);
  }
};

/**
 * Gets and parses JSON cookie value with fallback
 */
export const getCookieJSON = <T = unknown>(name: string): T | null => {
  const value = getCookie(name);
  if (!value) return null;
  
  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.warn('Failed to parse cookie JSON:', error);
    return LocalStorage.get<T>(name);
  }
};

/**
 * Removes a cookie with localStorage cleanup
 */
export const removeCookie = (name: string): void => {
  try {
    Cookies.remove(name);
  } catch (error) {
    console.warn('Cookie removal failed:', error);
  }
  
  LocalStorage.remove(name);
};

/**
 * Checks if a cookie or localStorage item exists
 */
export const hasCookie = (name: string): boolean => {
  try {
    return Cookies.get(name) !== undefined || LocalStorage.get(name) !== null;
  } catch (error) {
    console.warn('Cookie check failed:', error);
    return LocalStorage.get(name) !== null;
  }
};

/**
 * Safe cookie setting with error handling
 */
export const setCookieSafe = (
  name: string,
  value: string | object,
  days?: number
): boolean => {
  try {
    setCookie(name, value, days);
    return true;
  } catch (error) {
    console.error('Failed to set cookie:', error);
    return false;
  }
};