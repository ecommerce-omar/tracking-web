
interface StorageItem<T> {
  data: T;
  timestamp: number;
  ttl?: number; // Time to live in milliseconds
}

export class LocalStorage {
  private static isAvailable(): boolean {
    try {
      const test = 'storage-test';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  static set<T>(key: string, data: T, ttl?: number): boolean {
    if (!this.isAvailable()) return false;

    try {
      const item: StorageItem<T> = {
        data,
        timestamp: Date.now(),
        ttl,
      };
      
      localStorage.setItem(key, JSON.stringify(item));
      return true;
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
      return false;
    }
  }

  static get<T>(key: string): T | null {
    if (!this.isAvailable()) return null;

    try {
      const item = localStorage.getItem(key);
      if (!item) return null;

      const parsed: StorageItem<T> = JSON.parse(item);
      
      // Check if item has expired
      if (parsed.ttl && Date.now() - parsed.timestamp > parsed.ttl) {
        this.remove(key);
        return null;
      }

      return parsed.data;
    } catch (error) {
      console.warn('Failed to read from localStorage:', error);
      this.remove(key);
      return null;
    }
  }

  static remove(key: string): boolean {
    if (!this.isAvailable()) return false;

    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn('Failed to remove from localStorage:', error);
      return false;
    }
  }

  static clear(): boolean {
    if (!this.isAvailable()) return false;

    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
      return false;
    }
  }
}

export class SessionStorage {
  private static isAvailable(): boolean {
    try {
      const test = 'storage-test';
      sessionStorage.setItem(test, test);
      sessionStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  static set<T>(key: string, data: T): boolean {
    if (!this.isAvailable()) return false;

    try {
      sessionStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.warn('Failed to save to sessionStorage:', error);
      return false;
    }
  }

  static get<T>(key: string): T | null {
    if (!this.isAvailable()) return null;

    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.warn('Failed to read from sessionStorage:', error);
      this.remove(key);
      return null;
    }
  }

  static remove(key: string): boolean {
    if (!this.isAvailable()) return false;

    try {
      sessionStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn('Failed to remove from sessionStorage:', error);
      return false;
    }
  }
}

// Storage keys
export const STORAGE_KEYS = {
  TABLE_PREFERENCES: (prefix: string) => `${prefix}_table_preferences`,
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
  FILTER_STATE: (prefix: string) => `${prefix}_filters`,
  SEARCH_HISTORY: 'search_history',
} as const;