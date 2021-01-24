import { Inject, Injectable } from '@angular/core';
import { LOGGER } from '../global-providers';
import { Logger, LogLevel } from '../models/core';
import { EnvironmentService } from './environment.service';

@Injectable({
  providedIn: 'root'
})
export class LoggerService implements Logger {
  public readonly logLevel: LogLevel;

  private readonly clientLogger: Logger;

  private readonly clientSideLoggingEnabled: boolean;

  public constructor(@Inject(LOGGER) clientLogger: Logger, { logLevel, clientSideLoggingEnabled }: EnvironmentService) {
    this.clientLogger = clientLogger;
    this.logLevel = logLevel;
    this.clientSideLoggingEnabled = clientSideLoggingEnabled;
  }

  public debug(message?: unknown, ...optionalParams: any[]): void {
    if (this.logLevel <= LogLevel.Debug) {
      if (this.clientSideLoggingEnabled) {
        this.clientLogger.debug(`DEBUG: ${message}`, ...optionalParams);
      }
    }
  }

  public info(message?: unknown, ...optionalParams: any[]): void {
    if (this.logLevel <= LogLevel.Info) {
      if (this.clientSideLoggingEnabled) {
        this.clientLogger.info(`INFO: ${message}`, ...optionalParams);
      }
    }
  }

  public warn(message?: unknown, ...optionalParams: any[]): void {
    if (this.logLevel <= LogLevel.Warn) {
      if (this.clientSideLoggingEnabled) {
        this.clientLogger.warn(`WARN: ${message}`, ...optionalParams);
      }
    }
  }

  public error(message?: unknown, ...optionalParams: any[]): void {
    if (this.logLevel <= LogLevel.Error) {
      if (this.clientSideLoggingEnabled) {
        this.clientLogger.error(`ERROR: ${message}`, ...optionalParams);
      }
    }
  }
}
