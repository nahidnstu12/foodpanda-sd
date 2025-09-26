import {
  getLogger,
  apiLogger,
  databaseLogger,
  authLogger,
  emailLogger,
  appLogger,
  createRequestLogger,
  createErrorLogger,
  logDatabaseQuery,
  logEmailSent,
  logPerformance,
  closeAllLoggers,
} from "../lib/logger";

// Example usage in different parts of your application

// 1. Basic logging
export function exampleBasicLogging() {
  const logger = getLogger("example-service");

  logger.info("Application started");
  logger.warn("This is a warning message");
  logger.error("This is an error message", { errorCode: "E001" });
  logger.debug("Debug information", { userId: "123", action: "login" });
}

// 2. Service-specific logging
export function exampleServiceLogging() {
  // API logging
  apiLogger.info("API endpoint called", {
    endpoint: "/api/users",
    method: "GET",
  });

  // Database logging
  databaseLogger.warn("Slow query detected", {
    query: "SELECT * FROM users",
    duration: 1500,
  });

  // Auth logging
  authLogger.info("User login successful", {
    userId: "user123",
    ip: "192.168.1.1",
  });

  // Email logging
  emailLogger.info("Email sent", {
    to: "user@example.com",
    subject: "Welcome",
  });
}

// 3. Performance logging
export function examplePerformanceLogging() {
  const logger = getLogger("performance");

  // Start timer
  logger.time("database-operation");

  // Simulate some work
  setTimeout(() => {
    // End timer (automatically logs duration)
    logger.timeEnd("database-operation");
  }, 1000);

  // Manual performance logging
  logPerformance("file-upload", 2500, { fileSize: "5MB", userId: "user123" });
}

// 4. Error handling with logging
export function exampleErrorHandling() {
  const logger = getLogger("error-handler");

  try {
    throw new Error("Something went wrong");
  } catch (error: any) {
    logger.error("Unhandled error occurred", {
      error: error.message,
      stack: error.stack,
      context: "user-registration",
    });
  }
}

// 5. Request/Response logging middleware
export const requestLoggingMiddleware = createRequestLogger();
export const errorLoggingMiddleware = createErrorLogger();

// 6. Database query logging wrapper
export function wrapDatabaseQuery(queryFn: Function) {
  return async (...args: any[]) => {
    const startTime = Date.now();
    try {
      const result = await queryFn(...args);
      const duration = Date.now() - startTime;
      logDatabaseQuery(queryFn.name, args, duration);
      return result;
    } catch (error: any) {
      const duration = Date.now() - startTime;
      databaseLogger.error("Database query failed", {
        query: queryFn.name,
        args,
        duration,
        error: error.message,
      });
      throw error;
    }
  };
}

// 7. Email service integration
export function wrapEmailService(emailFn: Function) {
  return async (...args: any[]) => {
    try {
      const result = await emailFn(...args);
      logEmailSent(args[0], args[1], true);
      return result;
    } catch (error: any) {
      logEmailSent(args[0], args[1], false, error.message);
      throw error;
    }
  };
}

// 8. Graceful shutdown
export async function gracefulShutdown() {
  console.log("Shutting down gracefully...");
  await closeAllLoggers();
  process.exit(0);
}

// Register shutdown handlers
process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
process.on("uncaughtException", (error) => {
  appLogger.error("Uncaught exception", {
    error: error.message,
    stack: error.stack,
  });
  gracefulShutdown();
});

process.on("unhandledRejection", (reason, promise) => {
  appLogger.error("Unhandled rejection", { reason, promise });
});
