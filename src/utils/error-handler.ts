import { ERROR_MESSAGES } from '@/constants/app.constants';

export interface AppError extends Error {
  code?: string;
  statusCode?: number;
  originalError?: unknown;
}

export class ServiceError extends Error implements AppError {
  public code?: string;
  public statusCode?: number;
  public originalError?: unknown;

  constructor(
    message: string, 
    code?: string, 
    statusCode?: number, 
    originalError?: unknown
  ) {
    super(message);
    this.name = 'ServiceError';
    this.code = code;
    this.statusCode = statusCode;
    this.originalError = originalError;
  }
}

export const createError = (
  message: string,
  code?: string,
  statusCode?: number,
  originalError?: unknown
): ServiceError => {
  return new ServiceError(message, code, statusCode, originalError);
};

export const handleSupabaseError = (error: unknown): ServiceError => {
  if (error && typeof error === 'object' && 'message' in error) {
    const supabaseError = error as { message: string; code?: string };
    
    switch (supabaseError.code) {
      case 'PGRST116':
        return createError(ERROR_MESSAGES.NOT_FOUND, 'NOT_FOUND', 404, error);
      case 'PGRST401':
        return createError(ERROR_MESSAGES.UNAUTHORIZED, 'UNAUTHORIZED', 401, error);
      default:
        return createError(
          supabaseError.message || ERROR_MESSAGES.GENERIC,
          supabaseError.code,
          500,
          error
        );
    }
  }
  
  return createError(ERROR_MESSAGES.GENERIC, 'UNKNOWN', 500, error);
};

export const handleApiError = (error: unknown): ServiceError => {
  if (error instanceof ServiceError) {
    return error;
  }
  
  if (error instanceof Error) {
    return createError(error.message, 'CLIENT_ERROR', 400, error);
  }
  
  return createError(ERROR_MESSAGES.GENERIC, 'UNKNOWN', 500, error);
};

export const isNetworkError = (error: unknown): boolean => {
  return error instanceof Error && 
    (error.message.includes('NetworkError') || 
     error.message.includes('fetch'));
};

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof ServiceError) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return ERROR_MESSAGES.GENERIC;
};