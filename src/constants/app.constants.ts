// Re-export from centralized config
export { appConfig as APP_CONFIG } from '@/config/app.config';

export const QUERY_KEYS = {
  TRACKINGS: ['trackings'],
  TRACKING_BY_ID: (id: string) => ['trackings', id],
  EMAIL_TEMPLATES: ['email-templates'],
  DASHBOARD_DATA: ['dashboard-data'],
  CHART_DATA: ['chart-data'],
} as const;

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/',
  TRACKINGS: '/trackings',
  SHIPMENTS: '/shipments',
  TEMPLATES: '/templates-email',
  TRACKING: '/tracking',
} as const;

export const ERROR_MESSAGES = {
  GENERIC: 'Ocorreu um erro inesperado. Tente novamente.',
  NETWORK: 'Erro de conexão. Verifique sua internet.',
  NOT_FOUND: 'Item não encontrado.',
  UNAUTHORIZED: 'Acesso não autorizado.',
  VALIDATION: 'Dados inválidos fornecidos.',
} as const;