import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { catchError, mergeMap } from 'rxjs/operators';
import { LoggerService } from '../services/logger.service';

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {
  private readonly authService: AuthService;

  private readonly logger: LoggerService;

  public constructor(authService: AuthService, logger: LoggerService) {
    this.authService = authService;
    this.logger = logger;
  }

  public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError(error => {
        if (
          error instanceof HttpErrorResponse &&
          this.authService.shouldRefreshAccessTokenAndRetryRequestForError(error)
        ) {
          this.logger.debug(
            `${RefreshTokenInterceptor.name}.${this.intercept.name}: Refresh token should be refreshed.`
          );

          return this.authService.refreshAccessToken().pipe(
            mergeMap(() => {
              this.logger.debug(
                `${RefreshTokenInterceptor.name}.${this.intercept.name}: Token refresh successful. Retrying request.`
              );

              return next.handle(request);
            })
          );
        }

        this.logger.debug(
          `${RefreshTokenInterceptor.name}.${this.intercept.name}: Refresh token should not be refreshed and request should not be retried.`
        );

        return throwError(error);
      })
    );
  }
}
