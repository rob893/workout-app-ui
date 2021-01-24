import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';
import { HttpRequestOptions, HttpVerb } from '../models/http';
import { PendingHttpService } from './pending-http.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private readonly pendingService: PendingHttpService;

  private readonly http: HttpClient;

  public constructor(pendingService: PendingHttpService, http: HttpClient) {
    this.pendingService = pendingService;
    this.http = http;
  }

  public get<T>(url: string, options?: HttpRequestOptions): Observable<T> {
    if (options && options.disablePendingInterceptor) {
      return this.http.get<T>(url, options);
    }

    return this.pendingService.intercept(HttpVerb.Get, url, this.http.get<T>(url, options).pipe(share()));
  }

  public post<T>(url: string, body?: unknown | null, options?: HttpRequestOptions): Observable<T> {
    if (options && options.disablePendingInterceptor) {
      return this.http.post<T>(url, body, options);
    }

    return this.pendingService.intercept(HttpVerb.Post, url, this.http.post<T>(url, body, options)).pipe(share());
  }

  public put<T>(url: string, body?: unknown | null, options?: HttpRequestOptions): Observable<T> {
    if (options && options.disablePendingInterceptor) {
      return this.http.put<T>(url, body, options);
    }

    return this.pendingService.intercept(HttpVerb.Put, url, this.http.put<T>(url, body, options)).pipe(share());
  }

  public patch<T>(url: string, body?: unknown | null, options?: HttpRequestOptions): Observable<T> {
    if (options && options.disablePendingInterceptor) {
      return this.http.patch<T>(url, body, options);
    }

    return this.pendingService.intercept(HttpVerb.Patch, url, this.http.patch<T>(url, body, options)).pipe(share());
  }

  public delete<T>(url: string, options?: HttpRequestOptions): Observable<T> {
    if (options && options.disablePendingInterceptor) {
      return this.http.delete<T>(url, options);
    }

    return this.pendingService.intercept(HttpVerb.Delete, url, this.http.delete<T>(url, options)).pipe(share());
  }
}
