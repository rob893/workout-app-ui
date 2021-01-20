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

  public debug(message?: unknown, ...optionalParams: any[]): void {
    this.logger.debug(message, ...optionalParams);
  }

  public info(message?: unknown, ...optionalParams: any[]): void {
    this.logger.debug(message, ...optionalParams);
  }

  public warn(message?: unknown, ...optionalParams: any[]): void {
    this.logger.debug(message, ...optionalParams);
  }

  public error(message?: unknown, ...optionalParams: any[]): void {
    this.logger.debug(message, ...optionalParams);
  }
}
