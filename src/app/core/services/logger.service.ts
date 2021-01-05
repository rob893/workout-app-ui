import { Inject, Injectable } from '@angular/core';
import { LOGGER } from '../global-providers';
import { Logger } from '../models/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService implements Logger {
  private readonly logger: Logger;

  public constructor(@Inject(LOGGER) logger: Logger) {
    this.logger = logger;
  }

  public debug(...args: any[]): void {
    this.logger.debug(args);
  }

  public info(...args: any[]): void {
    this.logger.debug(args);
  }

  public warn(...args: any[]): void {
    this.logger.debug(args);
  }

  public error(...args: any[]): void {
    this.logger.debug(args);
  }
}
