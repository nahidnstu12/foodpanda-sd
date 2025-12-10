# Production Logger System

A comprehensive, production-ready logging system with colorized output, multiple transport methods, and service-based architecture.

## Features

- **Multiple Log Levels**: ERROR, WARN, INFO, HTTP, VERBOSE, DEBUG, SILLY
- **Colorized Output**: Beautiful console output with colors (development)
- **Multiple Transports**: Console, File, Database, Remote
- **Service-Based**: Different loggers for different services (API, Database, Auth, Email, etc.)
- **Performance Tracking**: Built-in timing and performance monitoring
- **Request Context**: Automatic request ID tracking and user context
- **Production Ready**: Optimized for production with batching and error handling

## Quick Start

```typescript
import { getLogger, apiLogger, emailLogger } from "./lib/logger";

// Use service-specific loggers
apiLogger.info("API endpoint called", { endpoint: "/api/users" });
emailLogger.error("Email failed", {
  to: "user@example.com",
  error: "SMTP timeout",
});

// Or create custom logger
const logger = getLogger("my-service");
logger.debug("Debug info", { userId: "123" });
```

## Configuration

### Environment Variables

```bash
# Log level (ERROR, WARN, INFO, HTTP, VERBOSE, DEBUG, SILLY)
LOG_LEVEL=INFO

# Transports (console, file, database, remote)
LOG_TRANSPORTS=console,file

# Enable colorized output
LOG_COLORIZE=true

# Database logging
LOG_DATABASE=false

# Remote logging
LOG_REMOTE_ENDPOINT=https://logs.example.com/api/logs
LOG_REMOTE_API_KEY=your-api-key
```

### Service-Specific Configurations

```typescript
import { loggerConfigs } from "./lib/logger/config";

// Pre-configured loggers for different services
const apiLogger = getLogger("api"); // Console + File
const dbLogger = getLogger("database"); // Console + File, WARN level
const authLogger = getLogger("auth"); // Console + File + Database
const emailLogger = getLogger("email"); // Console + File
```

## Usage Examples

### Basic Logging

```typescript
import { getLogger } from "./lib/logger";

const logger = getLogger("user-service");

logger.info("User created successfully", {
  userId: "123",
  email: "user@example.com",
});
logger.warn("Slow database query", {
  query: "SELECT * FROM users",
  duration: 1500,
});
logger.error("Failed to send email", { error: "SMTP timeout", userId: "123" });
logger.debug("Cache hit", { key: "user:123", ttl: 3600 });
```

### Performance Tracking

```typescript
const logger = getLogger("performance");

// Automatic timing
logger.time("database-operation");
await performDatabaseOperation();
logger.timeEnd("database-operation"); // Logs: "Timer database-operation completed (+1250ms)"

// Manual performance logging
logPerformance("file-upload", 2500, { fileSize: "5MB", userId: "user123" });
```

### Request/Response Logging

```typescript
import { createRequestLogger, createErrorLogger } from "./lib/logger";

// Express middleware
app.use(createRequestLogger());
app.use(createErrorLogger());

// Next.js middleware (already integrated)
// See src/middleware.ts
```

### Database Query Logging

```typescript
import { wrapDatabaseQuery } from "./lib/logger";

const loggedQuery = wrapDatabaseQuery(async (userId: string) => {
  return await prisma.user.findUnique({ where: { id: userId } });
});

// Automatically logs query execution time and results
await loggedQuery("user123");
```

### Email Service Integration

```typescript
import { emailLogger } from "./lib/logger";

// Already integrated in EmailService
// Automatically logs all email operations with success/failure status
```

## Log Levels

| Level   | Description             | Use Case                                         |
| ------- | ----------------------- | ------------------------------------------------ |
| ERROR   | Error conditions        | Exceptions, failures, critical issues            |
| WARN    | Warning conditions      | Slow queries, deprecated usage, potential issues |
| INFO    | Informational messages  | General application flow, successful operations  |
| HTTP    | HTTP requests/responses | API calls, middleware logging                    |
| VERBOSE | Verbose information     | Detailed flow information                        |
| DEBUG   | Debug information       | Development debugging, detailed state            |
| SILLY   | Silly information       | Very detailed debugging                          |

## Transports

### Console Transport

- Colorized output in development
- Plain text in production
- Automatic level-based console methods (console.error, console.warn, etc.)

### File Transport

- JSON formatted logs
- Automatic log rotation
- Configurable file size and retention

### Database Transport

- Stores logs in PostgreSQL
- Batch processing for performance
- Indexed for fast queries

### Remote Transport

- Send logs to external services
- Batch processing with timeout
- Automatic retry on failure

## Database Schema

The logger requires a `logs` table in your database:

```sql
CREATE TABLE logs (
  id TEXT PRIMARY KEY,
  level TEXT NOT NULL,
  message TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW(),
  service TEXT,
  user_id TEXT,
  request_id TEXT,
  metadata TEXT, -- JSON
  stack TEXT,
  duration INTEGER -- milliseconds
);

CREATE INDEX idx_logs_level ON logs(level);
CREATE INDEX idx_logs_timestamp ON logs(timestamp);
CREATE INDEX idx_logs_service ON logs(service);
CREATE INDEX idx_logs_user_id ON logs(user_id);
CREATE INDEX idx_logs_request_id ON logs(request_id);
```

## Production Considerations

### Performance

- Database transport uses batching (default: 10 logs per batch)
- File transport is asynchronous
- Remote transport has configurable timeouts
- Log levels filter out unnecessary logs

### Error Handling

- Transport failures don't crash the application
- Failed transports are logged to console
- Graceful degradation when transports fail

### Security

- Sensitive data should not be logged
- Use metadata carefully for user information
- Consider log retention policies

### Monitoring

- Monitor log file sizes
- Set up alerts for ERROR level logs
- Monitor database log table growth
- Track performance metrics from logs

## Migration from Console.log

Replace console.log statements:

```typescript
// Before
console.log("User logged in:", userId);
console.error("Database error:", error);

// After
import { getLogger } from "./lib/logger";
const logger = getLogger("auth");

logger.info("User logged in", { userId });
logger.error("Database error", { error: error.message, stack: error.stack });
```

## Troubleshooting

### Logs not appearing

1. Check LOG_LEVEL environment variable
2. Verify LOG_TRANSPORTS includes desired transport
3. Check file permissions for file transport
4. Verify database connection for database transport

### Performance issues

1. Reduce LOG_LEVEL in production
2. Use fewer transports
3. Increase batch sizes for database transport
4. Monitor log file sizes

### Color issues

1. Set LOG_COLORIZE=false in production
2. Check terminal color support
3. Use LOG_COLORIZE=true in development

## API Reference

### Logger Interface

```typescript
interface LoggerInterface {
  error(message: string, metadata?: Record<string, any>): void;
  warn(message: string, metadata?: Record<string, any>): void;
  info(message: string, metadata?: Record<string, any>): void;
  http(message: string, metadata?: Record<string, any>): void;
  verbose(message: string, metadata?: Record<string, any>): void;
  debug(message: string, metadata?: Record<string, any>): void;
  silly(message: string, metadata?: Record<string, any>): void;

  setUserId(userId: string): void;
  setRequestId(requestId: string): void;
  setService(service: string): void;

  time(label: string): void;
  timeEnd(label: string): void;
}
```

### Utility Functions

```typescript
// Get logger instance
getLogger(service: string): Logger

// Pre-configured loggers
apiLogger: Logger
databaseLogger: Logger
authLogger: Logger
emailLogger: Logger
appLogger: Logger

// Middleware
createRequestLogger(): Middleware
createErrorLogger(): Middleware

// Utilities
logDatabaseQuery(query: string, params: any[], duration: number): void
logEmailSent(to: string, subject: string, success: boolean, error?: string): void
logPerformance(operation: string, duration: number, metadata?: Record<string, any>): void
closeAllLoggers(): Promise<void>
```
