import {
  LogLevel,
  LogTransport,
  LogEntry,
  LoggerConfig,
  LogTransportInterface,
} from "./types";

export class ConsoleTransport implements LogTransportInterface {
  private config: LoggerConfig;
  private colors = {
    [LogLevel.ERROR]: "\x1b[31m", // Red
    [LogLevel.WARN]: "\x1b[33m", // Yellow
    [LogLevel.INFO]: "\x1b[36m", // Cyan
    [LogLevel.HTTP]: "\x1b[35m", // Magenta
    [LogLevel.VERBOSE]: "\x1b[37m", // White
    [LogLevel.DEBUG]: "\x1b[32m", // Green
    [LogLevel.SILLY]: "\x1b[90m", // Gray
  };
  private reset = "\x1b[0m";
  private bold = "\x1b[1m";

  constructor(config: LoggerConfig) {
    this.config = config;
  }

  async log(entry: LogEntry): Promise<void> {
    if (entry.level > this.config.level) return;

    const levelName = LogLevel[entry.level];
    const timestamp = this.config.timestamp
      ? entry.timestamp.toISOString()
      : "";

    let output = "";

    if (this.config.colorize) {
      const color = this.colors[entry.level];
      const levelStr = `${color}${this.bold}[${levelName}]${this.reset}`;
      const serviceStr = entry.service
        ? `${color}[${entry.service}]${this.reset}`
        : "";
      const timestampStr = timestamp ? `${color}${timestamp}${this.reset}` : "";

      output = `${levelStr} ${serviceStr} ${timestampStr} ${entry.message}`;
    } else {
      const levelStr = `[${levelName}]`;
      const serviceStr = entry.service ? `[${entry.service}]` : "";
      const timestampStr = timestamp ? `${timestamp}` : "";

      output = `${levelStr} ${serviceStr} ${timestampStr} ${entry.message}`;
    }

    // Add metadata if present
    if (entry.metadata && Object.keys(entry.metadata).length > 0) {
      output += `\n${
        this.config.colorize ? this.colors[entry.level] : ""
      }${JSON.stringify(entry.metadata, null, 2)}${
        this.config.colorize ? this.reset : ""
      }`;
    }

    // Add stack trace for errors
    if (entry.stack && entry.level === LogLevel.ERROR) {
      output += `\n${this.config.colorize ? this.colors[entry.level] : ""}${
        entry.stack
      }${this.config.colorize ? this.reset : ""}`;
    }

    // Add duration if present
    if (entry.duration !== undefined) {
      output += ` ${this.config.colorize ? this.colors[entry.level] : ""}(+${
        entry.duration
      }ms)${this.config.colorize ? this.reset : ""}`;
    }

    // Use appropriate console method
    switch (entry.level) {
      case LogLevel.ERROR:
        console.error(output);
        break;
      case LogLevel.WARN:
        console.warn(output);
        break;
      case LogLevel.INFO:
      case LogLevel.HTTP:
        console.info(output);
        break;
      default:
        console.log(output);
    }
  }

  async close(): Promise<void> {
    // Console transport doesn't need cleanup
  }
}

export class FileTransport implements LogTransportInterface {
  private config: LoggerConfig;
  private fs: any;
  private path: any;

  constructor(config: LoggerConfig) {
    this.config = config;
    // Dynamic imports for Node.js modules
    this.fs = require("fs");
    this.path = require("path");
  }

  async log(entry: LogEntry): Promise<void> {
    if (entry.level > this.config.level) return;
    if (!this.config.file) return;

    const logLine = this.formatLogEntry(entry);
    const logPath = this.path.join(
      process.cwd(),
      "logs",
      this.config.file.filename
    );

    // Ensure logs directory exists
    const logDir = this.path.dirname(logPath);
    if (!this.fs.existsSync(logDir)) {
      this.fs.mkdirSync(logDir, { recursive: true });
    }

    // Append to file
    this.fs.appendFileSync(logPath, logLine + "\n");
  }

  private formatLogEntry(entry: LogEntry): string {
    const levelName = LogLevel[entry.level];
    const timestamp = entry.timestamp.toISOString();
    const service = entry.service || "unknown";

    return JSON.stringify({
      timestamp,
      level: levelName,
      service,
      message: entry.message,
      userId: entry.userId,
      requestId: entry.requestId,
      metadata: entry.metadata,
      stack: entry.stack,
      duration: entry.duration,
    });
  }

  async close(): Promise<void> {
    // File transport doesn't need cleanup
  }
}

export class DatabaseTransport implements LogTransportInterface {
  private config: LoggerConfig;
  private prisma: any;
  private batch: LogEntry[] = [];
  private batchTimeout: NodeJS.Timeout | null = null;

  constructor(config: LoggerConfig, prisma: any) {
    this.config = config;
    this.prisma = prisma;
  }

  async log(entry: LogEntry): Promise<void> {
    if (entry.level > this.config.level) return;
    if (!this.config.database) return;

    this.batch.push(entry);

    // Process batch if it reaches the batch size
    if (this.batch.length >= (this.config.database.batchSize || 10)) {
      await this.flushBatch();
    } else {
      // Set timeout to flush batch after a delay
      if (this.batchTimeout) {
        clearTimeout(this.batchTimeout);
      }
      this.batchTimeout = setTimeout(() => this.flushBatch(), 1000);
    }
  }

  private async flushBatch(): Promise<void> {
    if (this.batch.length === 0) return;

    try {
      const logs = this.batch.map((entry) => ({
        level: LogLevel[entry.level],
        message: entry.message,
        timestamp: entry.timestamp,
        service: entry.service,
        userId: entry.userId,
        requestId: entry.requestId,
        metadata: entry.metadata ? JSON.stringify(entry.metadata) : null,
        stack: entry.stack,
        duration: entry.duration,
      }));

      await this.prisma.log.createMany({
        data: logs,
      });

      this.batch = [];
    } catch (error) {
      console.error("Failed to write logs to database:", error);
      this.batch = [];
    }
  }

  async close(): Promise<void> {
    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
    }
    await this.flushBatch();
  }
}

export class RemoteTransport implements LogTransportInterface {
  private config: LoggerConfig;
  private batch: LogEntry[] = [];
  private batchTimeout: NodeJS.Timeout | null = null;

  constructor(config: LoggerConfig) {
    this.config = config;
  }

  async log(entry: LogEntry): Promise<void> {
    if (entry.level > this.config.level) return;
    if (!this.config.remote) return;

    this.batch.push(entry);

    // Process batch if it reaches the batch size
    if (this.batch.length >= 10) {
      await this.flushBatch();
    } else {
      // Set timeout to flush batch after a delay
      if (this.batchTimeout) {
        clearTimeout(this.batchTimeout);
      }
      this.batchTimeout = setTimeout(() => this.flushBatch(), 2000);
    }
  }

  private async flushBatch(): Promise<void> {
    if (this.batch.length === 0) return;

    try {
      const response = await fetch(this.config.remote!.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.config.remote!.apiKey}`,
        },
        body: JSON.stringify({
          logs: this.batch,
        }),
        signal: AbortSignal.timeout(this.config.remote!.timeout || 5000),
      });

      if (!response.ok) {
        throw new Error(`Remote logging failed: ${response.status}`);
      }

      this.batch = [];
    } catch (error) {
      console.error("Failed to send logs to remote service:", error);
      this.batch = [];
    }
  }

  async close(): Promise<void> {
    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
    }
    await this.flushBatch();
  }
}
