import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { EnvironmentService } from '../services/environment.service';
import { LoggerService } from '../services/logger.service';
import { first, mergeMap, take } from 'rxjs/operators';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private readonly authService: AuthService;

  private readonly envService: EnvironmentService;

  private readonly logger: LoggerService;

  private readonly standardPorts: string[] = ['80', '443'];

  public constructor(authService: AuthService, envService: EnvironmentService, logger: LoggerService) {
    this.authService = authService;
    this.envService = envService;
    this.logger = logger;
  }

  public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!this.authService.isUserLoggedIn) {
      this.logger.debug('User is not logged in. Not changing request.');
      return next.handle(request);
    }

    if (!this.isAllowedDomain(request)) {
      this.logger.debug(`${request.url} is not an allowed host. Not changing request.`);
      return next.handle(request);
    }

    return this.authService.getAccessToken().pipe(
      take(1),
      mergeMap(token => {
        if (!token) {
          this.logger.debug('Token is null. Not changing request.');
          return next.handle(request);
        }

        this.logger.debug('Token is not null. Adding to request.');
        request = request.clone({
          setHeaders: {
            authorization: `Bearer ${token}`
          }
        });

        return next.handle(request);
      })
    );
  }

  private isAllowedDomain(request: HttpRequest<unknown>): boolean {
    const requestUrl: URL = new URL(request.url);

    const hostName = `${requestUrl.protocol}//${requestUrl.hostname}${
      requestUrl.port && !this.standardPorts.includes(requestUrl.port) ? ':' + requestUrl.port : ''
    }`;

    return this.envService.allowedHosts.includes(hostName);
  }
}
