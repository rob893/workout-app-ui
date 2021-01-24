import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { LoggerService } from '../services/logger.service';
import { catchError } from 'rxjs/operators';

@Injectable()
export class UnauthorizedInterceptor implements HttpInterceptor {
  private readonly authService: AuthService;

  private readonly logger: LoggerService;

  public constructor(authService: AuthService, logger: LoggerService) {
    this.authService = authService;
    this.logger = logger;
  }

  public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError(error => {
        if (this.authService.shouldErrorLogUserOut(error)) {
          this.logger.debug(
            `${UnauthorizedInterceptor.name}.${this.intercept.name}: The error should log the user out.`
          );
          this.authService.logout();
        } else {
          this.logger.debug(
            `${UnauthorizedInterceptor.name}.${this.intercept.name}: The error should not log the user out.`
          );
        }

        return throwError(error);
      })
    );
  }
}
