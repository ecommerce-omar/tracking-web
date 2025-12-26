/**
 * Centralized application configuration
 * Following the 12-factor app methodology
 */

export const appConfig = {
  // Application metadata
  app: {
    name: 'Tracking Web',
    version: '1.0.0',
    description: 'Sistema completo de rastreamento de pedidos',
    author: 'Your Company',
  },

  // Environment configuration
  env: {
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isTesting: process.env.NODE_ENV === 'test',
  },

  // API configuration
  api: {
    supabase: {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    },
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || '',
    timeout: 10000, // 10 seconds
  },

  // Cache configuration
  cache: {
    defaultTTL: 5 * 60 * 1000, // 5 minutes
    orders: {
      list: 5 * 60 * 1000,     // 5 minutes
      details: 2 * 60 * 1000,  // 2 minutes
    },
    dashboard: {
      data: 10 * 60 * 1000,    // 10 minutes
      charts: 15 * 60 * 1000,  // 15 minutes
    },
  },

  // Legacy cache structure for backward compatibility
  CACHE_DURATION: {
    ORDERS: 5 * 60 * 1000,        // 5 minutes
    ORDER_DETAILS: 2 * 60 * 1000, // 2 minutes
  },

  // Retry configuration
  RETRY: {
    MAX_ATTEMPTS: 3,
    DELAY: 1000, // 1 second
  },

  // Cookies configuration
  COOKIES: {
    EXPIRATION_DAYS: 30,
  },

  // Pagination configuration
  pagination: {
    defaultPageSize: 10,
    availablePageSizes: [10, 20, 30, 40, 50],
    maxPageSize: 100,
  },

  // Search configuration
  search: {
    debounceDelay: 300,      // 300ms
    minQueryLength: 2,
    maxResults: 100,
  },

  // Upload configuration
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
  },

  // Rate limiting
  rateLimit: {
    requests: 100,           // requests
    windowMs: 60 * 1000,     // per minute
    skipSuccessfulRequests: false,
  },

  // Security configuration
  security: {
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
    passwordMinLength: 8,
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes
    csrfTokenLength: 32,
  },

  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'warn' : 'debug'),
    maxLogEntries: 1000,
    enableConsole: process.env.NODE_ENV !== 'production',
    enableRemote: process.env.NODE_ENV === 'production',
  },

  // Monitoring configuration
  monitoring: {
    enablePerformance: true,
    enableErrorTracking: process.env.NODE_ENV === 'production',
    sampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  },

  // Feature flags
  features: {
    enablePushNotifications: process.env.NEXT_PUBLIC_ENABLE_PUSH_NOTIFICATIONS === 'true',
    enableAdvancedFilters: process.env.NEXT_PUBLIC_ENABLE_ADVANCED_FILTERS === 'true',
    enableExports: process.env.NEXT_PUBLIC_ENABLE_EXPORTS === 'true',
    enableBulkActions: process.env.NEXT_PUBLIC_ENABLE_BULK_ACTIONS === 'true',
    enableRealTimeUpdates: process.env.NEXT_PUBLIC_ENABLE_REALTIME === 'true',
  },

  // UI configuration
  ui: {
    defaultTheme: 'system',
    enableAnimations: true,
    showBreadcrumbs: true,
    compactMode: false,
    sidebarCollapsed: false,
  },

  // Date and time configuration
  dateTime: {
    locale: 'pt-BR',
    timezone: 'America/Sao_Paulo',
    dateFormat: 'dd/MM/yyyy',
    timeFormat: 'HH:mm',
    dateTimeFormat: 'dd/MM/yyyy HH:mm',
  },

  // Validation rules
  validation: {
    order: {
      nameMaxLength: 255,
      trackingCodeMaxLength: 50,
      maxProducts: 50,
      maxEvents: 100,
    },
    user: {
      nameMaxLength: 100,
      emailMaxLength: 255,
    },
  },

  // URLs and redirects
  urls: {
    home: '/',
    login: '/login',
    register: '/register',
    dashboard: '/dashboard',
    orders: '/orders',
    shipments: '/shipments',
    tracking: '/tracking',
    templates: '/templates-email',
    profile: '/profile',
    settings: '/settings',
  },

  // External services
  external: {
    correios: {
      baseUrl: 'https://www.correios.com.br',
      timeout: 15000,
    },
    analytics: {
      gtmId: process.env.NEXT_PUBLIC_GTM_ID,
      enableInDev: false,
    },
  },

  // Development tools
  dev: {
    showQueryDevtools: process.env.NODE_ENV === 'development',
    enableStorybook: process.env.NODE_ENV === 'development',
    enableMocks: process.env.NEXT_PUBLIC_ENABLE_MOCKS === 'true',
  },
} as const;

// Type definitions
export type AppConfig = typeof appConfig;
export type FeatureFlags = typeof appConfig.features;
export type UIConfig = typeof appConfig.ui;

// Configuration validation
export const validateConfig = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Required environment variables
  if (!appConfig.api.supabase.url) {
    errors.push('NEXT_PUBLIC_SUPABASE_URL is required');
  }

  if (!appConfig.api.supabase.anonKey) {
    errors.push('NEXT_PUBLIC_SUPABASE_ANON_KEY is required');
  }

  // Validate URLs
  if (appConfig.api.supabase.url && !isValidUrl(appConfig.api.supabase.url)) {
    errors.push('NEXT_PUBLIC_SUPABASE_URL must be a valid URL');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Helper functions
const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Export specific configurations for easy access
export const {
  app: appInfo,
  env: environment,
  api: apiConfig,
  cache: cacheConfig,
  features: featureFlags,
  ui: uiConfig,
  urls: routeUrls,
} = appConfig;