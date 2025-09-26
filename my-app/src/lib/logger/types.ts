export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  HTTP = 3,
  VERBOSE = 4,
  DEBUG = 5,
  SILLY = 6,
}

export enum LogTransport {
  CONSOLE = "console",
  FILE = "file",
  DATABASE = "database",
  REMOTE = "remote",
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  service?: string;
  userId?: string;
  requestId?: string;
  metadata?: Record<string, any>;
  stack?: string;
  duration?: number;
}

export interface LoggerConfig {
  level: LogLevel;
  transports: LogTransport[];
  service: string;
  colorize: boolean;
  timestamp: boolean;
  file?: {
    filename: string;
    maxSize: string;
    maxFiles: number;
  };
  database?: {
    table: string;
    batchSize: number;
  };
  remote?: {
    endpoint: string;
    apiKey: string;
    timeout: number;
  };
}

export interface LogTransportInterface {
  log(entry: LogEntry): Promise<void>;
  close(): Promise<void>;
}

export interface LoggerInterface {
  error(message: string, metadata?: Record<string, any>): void;
  warn(message: string, metadata?: Record<string, any>): void;
  info(message: string, metadata?: Record<string, any>): void;
  http(message: string, metadata?: Record<string, any>): void;
  verbose(message: string, metadata?: Record<string, any>): void;
  debug(message: string, metadata?: Record<string, any>): void;
  silly(message: string, metadata?: Record<string, any>): void;

  // Utility methods
  setUserId(userId: string): void;
  setRequestId(requestId: string): void;
  setService(service: string): void;

  // Performance tracking
  time(label: string): void;
  timeEnd(label: string): void;
}
