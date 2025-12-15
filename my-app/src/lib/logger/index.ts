import { Logger, createLogger } from "./logger";
import { loggerConfigs } from "./config";
import { db as prisma } from "../prisma";

// Global logger instances
const loggers = new Map<string, Logger>();

export function getLogger(service: string = "app"): Logger {
  if (!loggers.has(service)) {
    const config =
      loggerConfigs[service as keyof typeof loggerConfigs] || loggerConfigs.app;
    const logger = createLogger(config, prisma);
    loggers.set(service, logger);
  }
  return loggers.get(service)!;
}

// Convenience functions for common services
export const apiLogger = getLogger("api");
export const databaseLogger = getLogger("database");
export const authLogger = getLogger("auth");
export const emailLogger = getLogger("email");
export const appLogger = getLogger("app");

// HTTP request logging middleware
export function createRequestLogger() {
  return (req: any, res: any, next: any) => {
    const startTime = Date.now();
    const requestId =
      req.headers["x-request-id"] ||
      `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Set request context
    apiLogger.setRequestId(requestId);

    // Log request
    apiLogger.http(`${req.method} ${req.url}`, {
      method: req.method,
      url: req.url,
      userAgent: req.headers["user-agent"],
      ip: req.ip || req.connection.remoteAddress,
      headers: req.headers,
    });

    // Override res.end to log response
    const originalEnd = res.end;
    res.end = function (chunk: any, encoding: any) {
      const duration = Date.now() - startTime;

      apiLogger.http(`${req.method} ${req.url} - ${res.statusCode}`, {
        statusCode: res.statusCode,
        duration,
        contentLength: res.get("content-length"),
      });

      originalEnd.call(this, chunk, encoding);
    };

    next();
  };
}

// Error logging middleware
export function createErrorLogger() {
  return (error: any, req: any, res: any, next: any) => {
    const requestId = req.headers["x-request-id"] || "unknown";

    apiLogger.error(`Unhandled error in ${req.method} ${req.url}`, {
      error: error.message,
      stack: error.stack,
      requestId,
      method: req.method,
      url: req.url,
      body: req.body,
      query: req.query,
      params: req.params,
    });

    next(error);
  };
}

// Database query logging
export function logDatabaseQuery(
  query: string,
  params: any[],
  duration: number
) {
  databaseLogger.debug("Database query executed", {
    query: query.replace(/\s+/g, " ").trim(),
    params,
    duration,
  });
}

// Email logging
export function logEmailSent(
  to: string,
  subject: string,
  success: boolean,
  error?: string
) {
  if (success) {
    emailLogger.info("Email sent successfully", { to, subject });
  } else {
    emailLogger.error("Email sending failed", { to, subject, error });
  }
}

// Performance logging
export function logPerformance(
  operation: string,
  duration: number,
  metadata?: Record<string, any>
) {
  if (duration > 1000) {
    // Log slow operations (>1s)
    appLogger.warn(`Slow operation detected: ${operation}`, {
      duration,
      ...metadata,
    });
  } else {
    appLogger.debug(`Operation completed: ${operation}`, {
      duration,
      ...metadata,
    });
  }
}

// Cleanup function for graceful shutdown
export async function closeAllLoggers(): Promise<void> {
  const promises = Array.from(loggers.values()).map((logger) => logger.close());
  await Promise.allSettled(promises);
  loggers.clear();
}

// Export types for external use
export { LogLevel, LogTransport } from "./types";
export type { LogEntry, LoggerConfig, LoggerInterface } from "./types";
