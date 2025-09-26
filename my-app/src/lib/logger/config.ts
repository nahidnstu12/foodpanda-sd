import { LogLevel, LogTransport, LoggerConfig } from "./types";

export function getLogLevelFromEnv(): LogLevel {
  const level = process.env.LOG_LEVEL?.toUpperCase();
  switch (level) {
    case "ERROR":
      return LogLevel.ERROR;
    case "WARN":
      return LogLevel.WARN;
    case "INFO":
      return LogLevel.INFO;
    case "HTTP":
      return LogLevel.HTTP;
    case "VERBOSE":
      return LogLevel.VERBOSE;
    case "DEBUG":
      return LogLevel.DEBUG;
    case "SILLY":
      return LogLevel.SILLY;
    default:
      return LogLevel.INFO;
  }
}

export function getTransportsFromEnv(): LogTransport[] {
  const transports = process.env.LOG_TRANSPORTS?.split(",") || ["console"];
  return transports
    .map((t) => t.trim().toLowerCase() as LogTransport)
    .filter((t) => Object.values(LogTransport).includes(t));
}

export function createLoggerConfig(
  service: string,
  overrides?: Partial<LoggerConfig>
): LoggerConfig {
  const isDevelopment = process.env.NODE_ENV === "development";
  const isProduction = process.env.NODE_ENV === "production";

  const config: LoggerConfig = {
    level: getLogLevelFromEnv(),
    transports: getTransportsFromEnv(),
    service,
    colorize: isDevelopment || process.env.LOG_COLORIZE === "true",
    timestamp: true,
    file: {
      filename: `${service}.log`,
      maxSize: "10MB",
      maxFiles: 5,
    },
    database: {
      table: "logs",
      batchSize: isProduction ? 50 : 10,
    },
    remote: {
      endpoint: process.env.LOG_REMOTE_ENDPOINT || "",
      apiKey: process.env.LOG_REMOTE_API_KEY || "",
      timeout: 5000,
    },
  };

  // Production optimizations
  if (isProduction) {
    config.colorize = false;
    if (!config.transports.includes(LogTransport.FILE)) {
      config.transports.push(LogTransport.FILE);
    }
    if (
      process.env.LOG_DATABASE === "true" &&
      !config.transports.includes(LogTransport.DATABASE)
    ) {
      config.transports.push(LogTransport.DATABASE);
    }
  }

  // Development optimizations
  if (isDevelopment) {
    config.level = LogLevel.DEBUG;
    config.transports = [LogTransport.CONSOLE];
  }

  return { ...config, ...overrides };
}

export const loggerConfigs = {
  // API Logger
  api: createLoggerConfig("api", {
    transports: [LogTransport.CONSOLE, LogTransport.FILE],
    file: { filename: "api.log", maxSize: "10MB", maxFiles: 5 },
  }),

  // Database Logger
  database: createLoggerConfig("database", {
    level: LogLevel.WARN,
    transports: [LogTransport.CONSOLE, LogTransport.FILE],
    file: { filename: "database.log", maxSize: "10MB", maxFiles: 5 },
  }),

  // Auth Logger
  auth: createLoggerConfig("auth", {
    transports: [
      LogTransport.CONSOLE,
      LogTransport.FILE,
      LogTransport.DATABASE,
    ],
    file: { filename: "auth.log", maxSize: "10MB", maxFiles: 5 },
  }),

  // Email Logger
  email: createLoggerConfig("email", {
    transports: [LogTransport.CONSOLE, LogTransport.FILE],
    file: { filename: "email.log", maxSize: "10MB", maxFiles: 5 },
  }),

  // General App Logger
  app: createLoggerConfig("app", {
    transports: [LogTransport.CONSOLE, LogTransport.FILE],
    file: { filename: "app.log", maxSize: "10MB", maxFiles: 5 },
  }),
};
