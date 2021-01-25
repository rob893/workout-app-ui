import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { EnvironmentService } from '../services/environment.service';
import { mergeMap, retryWhen } from 'rxjs/operators';
import { LoggerService } from '../services/logger.service';
import { RetryOptions } from '../models/core';

@Injectable()
export class RetryInterceptor implements HttpInterceptor {
  private readonly retryOptions: RetryOptions;

  private readonly logger: LoggerService;

  public constructor({ retryOptions }: EnvironmentService, logger: LoggerService) {
    this.retryOptions = retryOptions;
    this.logger = logger;
  }

  public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      retryWhen(errors =>
        errors.pipe(
          mergeMap((error, totalRetries) => {
            const { enabled, maxRetryAttempts } = this.retryOptions;

            if (!enabled) {
              this.logger.info(`${RetryInterceptor.name}.${this.intercept.name}: Retry not enabled.`);
              return throwError(error);
            }

            if (totalRetries >= maxRetryAttempts) {
              this.logger.info(
                `${RetryInterceptor.name}.${this.intercept.name}: Max retries of ${maxRetryAttempts} reached. No longer attempting retries.`
              );
              return throwError(error);
            }

            if (!this.shouldRetry(error)) {
              this.logger.info(`${RetryInterceptor.name}.${this.intercept.name}: This request should not be retried.`);
              return throwError(error);
            }

            const timeToDelay = this.calculateDelayInMs(totalRetries);

            this.logger.info(
              `${RetryInterceptor.name}.${this.intercept.name}: Retry number ${
                totalRetries + 1
              } of ${maxRetryAttempts} after ${timeToDelay}ms.`
            );

            return timer(timeToDelay);
          })
        )
      )
    );
  }

  private shouldRetry(error: unknown): boolean {
    if (error instanceof HttpErrorResponse) {
      return error.status >= 500;
    }

    return false;
  }

  private calculateDelayInMs(retryNumber: number): number {
    return retryNumber <= 0 ? 0 : this.retryOptions.delayTimeInMs * 2 ** (retryNumber - 1);
  }
}
