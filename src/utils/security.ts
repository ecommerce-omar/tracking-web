/**
 * Security utilities for input sanitization and validation
 */

// XSS Protection
export const sanitizeHtml = (input: string): string => {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

export const sanitizeUrl = (url: string): string => {
  // Only allow http, https, and relative URLs
  const allowedProtocols = /^(https?:\/\/|\/)/i;
  
  if (!allowedProtocols.test(url)) {
    return '';
  }
  
  // Remove dangerous protocols
  const dangerousProtocols = /^(javascript|data|vbscript|file|ftp):/i;
  if (dangerousProtocols.test(url)) {
    return '';
  }
  
  return url;
};

// SQL Injection Protection (for client-side validation)
export const containsSqlInjection = (input: string): boolean => {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|SCRIPT)\b)/gi,
    /(--|\/\*|\*\/|;|'|"|`)/gi,
    /(\b(OR|AND)\b.*[=<>].*(\b(OR|AND)\b|$))/gi,
  ];
  
  return sqlPatterns.some(pattern => pattern.test(input));
};

// Content Security Policy helpers
export const isValidImageSrc = (src: string): boolean => {
  const validSources = [
    /^data:image\/(jpeg|jpg|png|gif|svg\+xml|webp);base64,/i,
    /^\/[^\/]/,  // Relative paths starting with /
    /^https:\/\//i,
  ];
  
  return validSources.some(pattern => pattern.test(src));
};

// Rate limiting helpers (client-side tracking)
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private static limits = new Map<string, RateLimitEntry>();
  
  static isAllowed(key: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now();
    const entry = this.limits.get(key);
    
    if (!entry || now > entry.resetTime) {
      this.limits.set(key, {
        count: 1,
        resetTime: now + windowMs,
      });
      return true;
    }
    
    if (entry.count >= maxRequests) {
      return false;
    }
    
    entry.count++;
    return true;
  }
  
  static reset(key: string): void {
    this.limits.delete(key);
  }
}

export { RateLimiter };

// Environment validation
export const validateEnvVars = (): { isValid: boolean; missing: string[] } => {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  return {
    isValid: missing.length === 0,
    missing,
  };
};

// Password strength validation
export const validatePasswordStrength = (password: string): {
  isStrong: boolean;
  score: number;
  feedback: string[];
} => {
  const feedback: string[] = [];
  let score = 0;
  
  if (password.length < 8) {
    feedback.push('Senha deve ter pelo menos 8 caracteres');
  } else {
    score += 1;
  }
  
  if (!/[a-z]/.test(password)) {
    feedback.push('Deve conter pelo menos uma letra minúscula');
  } else {
    score += 1;
  }
  
  if (!/[A-Z]/.test(password)) {
    feedback.push('Deve conter pelo menos uma letra maiúscula');
  } else {
    score += 1;
  }
  
  if (!/\d/.test(password)) {
    feedback.push('Deve conter pelo menos um número');
  } else {
    score += 1;
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    feedback.push('Deve conter pelo menos um caractere especial');
  } else {
    score += 1;
  }
  
  return {
    isStrong: score >= 4,
    score,
    feedback,
  };
};

// CSRF Token helpers (for future implementation)
export const generateCSRFToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Content validation
export const isValidFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type);
};

export const isValidFileSize = (file: File, maxSizeInMB: number): boolean => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};

// Prevent information disclosure
export const redactSensitiveInfo = (obj: unknown): unknown => {
  const sensitiveKeys = ['password', 'token', 'secret', 'key', 'authorization'];
  
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(redactSensitiveInfo);
  }
  
  const redacted = { ...obj } as Record<string, unknown>;
  
  for (const key of Object.keys(redacted)) {
    if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
      redacted[key] = '[REDACTED]';
    } else if (typeof redacted[key] === 'object') {
      redacted[key] = redactSensitiveInfo(redacted[key]);
    }
  }
  
  return redacted;
};