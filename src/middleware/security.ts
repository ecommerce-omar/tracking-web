import { NextRequest, NextResponse } from 'next/server';
import { RateLimiter, sanitizeHtml } from '@/utils/security';
import { logger, logSecurityEvent } from '@/utils/logger';

// Security headers configuration
const SECURITY_HEADERS = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
};

// CSP configuration
const CSP_DIRECTIVES = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Be more restrictive in production
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://*.supabase.co",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

export function applySecurityHeaders(response: NextResponse): NextResponse {
  // Apply security headers
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Apply Content Security Policy
  response.headers.set('Content-Security-Policy', CSP_DIRECTIVES);

  return response;
}

export function checkRateLimit(request: NextRequest): boolean {
  const clientIp = request.headers.get('x-forwarded-for') || 
                  request.headers.get('x-real-ip') || 
                  'anonymous';

  const key = `rate-limit:${clientIp}`;
  const isAllowed = RateLimiter.isAllowed(key, 100, 60 * 1000); // 100 requests per minute

  if (!isAllowed) {
    logSecurityEvent('Rate limit exceeded', { ip: clientIp, path: request.nextUrl.pathname });
  }

  return isAllowed;
}

export function sanitizeRequestBody(body: unknown): unknown {
  if (!body || typeof body !== 'object') {
    return body;
  }

  const sanitized = { ...body } as Record<string, unknown>;

  for (const [key, value] of Object.entries(sanitized)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeHtml(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeRequestBody(value);
    }
  }

  return sanitized;
}

export function validateOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  const host = request.headers.get('host');

  // Allow same-origin requests
  if (origin === `https://${host}` || origin === `http://${host}`) {
    return true;
  }

  // Allow requests without origin (direct navigation)
  if (!origin && !referer) {
    return true;
  }

  // Check against allowed origins in production
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
  
  if (origin && allowedOrigins.includes(origin)) {
    return true;
  }

  logSecurityEvent('Invalid origin detected', { 
    origin, 
    referer, 
    host, 
    path: request.nextUrl.pathname 
  });

  return false;
}

export function detectSuspiciousActivity(request: NextRequest): boolean {
  const userAgent = request.headers.get('user-agent') || '';
  const path = request.nextUrl.pathname;
  
  // Detect common attack patterns
  const suspiciousPatterns = [
    /\.\.(\/|\\)/,  // Directory traversal
    /<script/i,     // XSS attempts
    /union.*select/i, // SQL injection
    /eval\(/i,      // Code injection
  ];

  const isSuspicious = suspiciousPatterns.some(pattern => 
    pattern.test(path) || pattern.test(userAgent)
  );

  if (isSuspicious) {
    logSecurityEvent('Suspicious activity detected', {
      userAgent,
      path,
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
    });
  }

  return isSuspicious;
}

export function logRequest(request: NextRequest): void {
  const logData = {
    method: request.method,
    path: request.nextUrl.pathname,
    userAgent: request.headers.get('user-agent'),
    ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
    timestamp: new Date().toISOString(),
  };

  logger.debug('Request received', logData, 'Security');
}