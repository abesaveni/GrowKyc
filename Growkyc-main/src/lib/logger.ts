type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'none';

class Logger {
  private level: LogLevel = 'info';

  constructor() {
    const isProduction = typeof window !== 'undefined' && 
      (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1');
    
    this.level = isProduction ? 'error' : 'debug';

    // Global interceptor to silent un-managed console logs in production for ultimate safety
    if (isProduction) {
      try {
        const noop = () => {};
        (window as any).__originalConsole = {
          log: console.log,
          info: console.info,
          warn: console.warn,
          error: console.error,
          debug: console.debug,
        };
        console.log = noop;
        console.info = noop;
        console.warn = noop;
        console.debug = noop;
      } catch (e) {
        // Fallback silently if environment prevents modifications
      }
    }
  }

  setLogLevel(level: LogLevel) {
    this.level = level;
  }

  private shouldLog(msgLevel: LogLevel): boolean {
    const levels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
      none: 4,
    };
    return levels[msgLevel] >= levels[this.level];
  }

  debug(message: string, ...args: any[]) {
    if (this.shouldLog('debug')) {
      const orig = (window as any).__originalConsole?.debug || console.debug || console.log;
      orig(`[DEBUG] ${message}`, ...args);
    }
  }

  info(message: string, ...args: any[]) {
    if (this.shouldLog('info')) {
      const orig = (window as any).__originalConsole?.info || console.info || console.log;
      orig(`[INFO] ${message}`, ...args);
    }
  }

  warn(message: string, ...args: any[]) {
    if (this.shouldLog('warn')) {
      const orig = (window as any).__originalConsole?.warn || console.warn;
      orig(`[WARN] ${message}`, ...args);
    }
  }

  error(message: string, ...args: any[]) {
    if (this.shouldLog('error')) {
      const orig = (window as any).__originalConsole?.error || console.error;
      orig(`[ERROR] ${message}`, ...args);
    }
  }
}

export const logger = new Logger();
