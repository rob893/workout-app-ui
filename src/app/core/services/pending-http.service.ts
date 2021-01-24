import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { HttpVerb } from '../models/http';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class PendingHttpService {
  private readonly pendingRequests = new Map<string, Observable<unknown>>();

  private readonly logger: LoggerService;

  public constructor(logger: LoggerService) {
    this.logger = logger;
  }

  public intercept<T>(httpVerb: HttpVerb, url: string, request: Observable<T>): Observable<T> {
    const key = this.computeKey(httpVerb, url);
    const pendingRequest = this.pendingRequests.get(key);

    if (pendingRequest) {
      this.logger.debug(`${PendingHttpService.name}.${this.intercept.name}: Returning pending observable for ${key}`);
      return pendingRequest as Observable<T>;
    }

    this.logger.debug(
      `${PendingHttpService.name}.${this.intercept.name}: No pending observable found for ${key}. Sending request.`
    );

    return this.sendRequest(httpVerb, url, request);
  }

  private sendRequest<T>(httpVerb: HttpVerb, url: string, request: Observable<T>): Observable<T> {
    const key = this.computeKey(httpVerb, url);
    this.pendingRequests.set(key, request);
    return request.pipe(
      finalize(() => {
        this.logger.debug(
          `${PendingHttpService.name}.${this.sendRequest.name}: Removing ${key} from pending requests map.`
        );
        this.pendingRequests.delete(key);
      })
    );
  }

  private computeKey(httpVerb: HttpVerb, url: string): string {
    return `${httpVerb}:${url}`;
  }
}
