import {
  LogLevel,
  LogTransport,
  LogEntry,
  LoggerConfig,
  LoggerInterface,
  LogTransportInterface,
} from "./types";
import {
  ConsoleTransport,
  FileTransport,
  DatabaseTransport,
  RemoteTransport,
} from "./transports";

export class Logger implements LoggerInterface {
  private config: LoggerConfig;
  private transports: LogTransportInterface[] = [];
  private context: {
    userId?: string;
    requestId?: string;
    service?: string;
  } = {};
  private timers: Map<string, number> = new Map();

  constructor(config: LoggerConfig, prisma?: any) {
    this.config = config;
    this.context.service = config.service;
    this.initializeTransports(prisma);
  }

  private initializeTransports(prisma?: any): void {
    for (const transportType of this.config.transports) {
      switch (transportType) {
        case LogTransport.CONSOLE:
          this.transports.push(new ConsoleTransport(this.config));
          break;
        case LogTransport.FILE:
          this.transports.push(new FileTransport(this.config));
          break;
        case LogTransport.DATABASE:
          if (prisma) {
            this.transports.push(new DatabaseTransport(this.config, prisma));
          } else {
            console.warn("Database transport requires Prisma client");
          }
          break;
        case LogTransport.REMOTE:
          this.transports.push(new RemoteTransport(this.config));
          break;
      }
    }
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    metadata?: Record<string, any>
  ): LogEntry {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      service: this.context.service,
      userId: this.context.userId,
      requestId: this.context.requestId,
      metadata,
    };

    // Add stack trace for errors
    if (level === LogLevel.ERROR && !metadata?.stack) {
      const stack = new Error().stack;
      entry.stack = stack;
    }

    return entry;
  }

  private async log(
    level: LogLevel,
    message: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    const entry = this.createLogEntry(level, message, metadata);

    // Process all transports in parallel
    const promises = this.transports.map((transport) =>
      transport
        .log(entry)
        .catch((error) => console.error("Transport error:", error))
    );

    await Promise.allSettled(promises);
  }

  error(message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.ERROR, message, metadata);
  }

  warn(message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, metadata);
  }

  info(message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, metadata);
  }

  http(message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.HTTP, message, metadata);
  }

  verbose(message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.VERBOSE, message, metadata);
  }

  debug(message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, metadata);
  }

  silly(message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.SILLY, message, metadata);
  }

  setUserId(userId: string): void {
    this.context.userId = userId;
  }

  setRequestId(requestId: string): void {
    this.context.requestId = requestId;
  }

  setService(service: string): void {
    this.context.service = service;
  }

  time(label: string): void {
    this.timers.set(label, Date.now());
  }

  timeEnd(label: string): void {
    const startTime = this.timers.get(label);
    if (startTime) {
      const duration = Date.now() - startTime;
      this.timers.delete(label);
      this.info(`Timer ${label} completed`, { duration });
    }
  }

  async close(): Promise<void> {
    const promises = this.transports.map((transport) => transport.close());
    await Promise.allSettled(promises);
  }
}

// Factory function to create logger instances
export function createLogger(config: LoggerConfig, prisma?: any): Logger {
  return new Logger(config, prisma);
}

// Default logger configuration
export const defaultLoggerConfig: LoggerConfig = {
  level: LogLevel.INFO,
  transports: [LogTransport.CONSOLE],
  service: "app",
  colorize: true,
  timestamp: true,
  file: {
    filename: "app.log",
    maxSize: "10MB",
    maxFiles: 5,
  },
  database: {
    table: "logs",
    batchSize: 10,
  },
  remote: {
    endpoint: "",
    apiKey: "",
    timeout: 5000,
  },
};
