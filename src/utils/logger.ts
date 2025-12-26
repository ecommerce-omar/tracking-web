import { redactSensitiveInfo } from './security';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: unknown;
  context?: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  private log(level: LogLevel, message: string, data?: unknown, context?: string): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data: data ? redactSensitiveInfo(data) : undefined,
      context,
    };

    // Store in memory (limited)
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Console output in development
    if (this.isDevelopment) {
      const consoleMethod = level === 'debug' ? 'log' : level;
      const prefix = context ? `[${context}]` : '';
      
      console[consoleMethod](`${prefix} ${message}`, data || '');
    }

    // Send to monitoring service in production (future implementation)
    if (!this.isDevelopment && level === 'error') {
      this.sendToMonitoring(entry);
    }
  }

  debug(message: string, data?: unknown, context?: string): void {
    this.log('debug', message, data, context);
  }

  info(message: string, data?: unknown, context?: string): void {
    this.log('info', message, data, context);
  }

  warn(message: string, data?: unknown, context?: string): void {
    this.log('warn', message, data, context);
  }

  error(message: string, error?: Error | unknown, context?: string): void {
    const errorData = error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack,
    } : error;

    this.log('error', message, errorData, context);
  }

  private sendToMonitoring(entry: LogEntry): void {
    // Future implementation: send to monitoring service
    // Could use services like Sentry, LogRocket, etc.
    console.error('Production Error:', entry);
  }

  getLogs(level?: LogLevel): LogEntry[] {
    return level 
      ? this.logs.filter(log => log.level === level)
      : this.logs;
  }

  clearLogs(): void {
    this.logs = [];
  }

  // Performance monitoring
  time(label: string): void {
    if (this.isDevelopment) {
      console.time(label);
    }
  }

  timeEnd(label: string): void {
    if (this.isDevelopment) {
      console.timeEnd(label);
    }
  }

  // Async operation logging
  async logAsync<T>(
    operation: string,
    asyncFn: () => Promise<T>,
    context?: string
  ): Promise<T> {
    const startTime = Date.now();
    this.debug(`Starting ${operation}`, undefined, context);
    
    try {
      const result = await asyncFn();
      const duration = Date.now() - startTime;
      this.info(`${operation} completed in ${duration}ms`, undefined, context);
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.error(`${operation} failed after ${duration}ms`, error, context);
      throw error;
    }
  }
}

export const logger = new Logger();

// Utility functions for common logging scenarios
export const logApiCall = (method: string, url: string, status?: number, error?: Error): void => {
  if (error) {
    logger.error(`API ${method} ${url} failed`, error, 'API');
  } else {
    logger.info(`API ${method} ${url}`, { status }, 'API');
  }
};

export const logUserAction = (action: string, userId?: string, details?: unknown): void => {
  logger.info(`User action: ${action}`, { userId, ...(details && typeof details === 'object' ? details : {}) }, 'USER');
};

export const logSecurityEvent = (event: string, details?: unknown): void => {
  logger.warn(`Security event: ${event}`, details, 'SECURITY');
};

export const logPerformance = (metric: string, value: number, unit: string = 'ms'): void => {
  logger.info(`Performance: ${metric}`, { value, unit }, 'PERFORMANCE');
};