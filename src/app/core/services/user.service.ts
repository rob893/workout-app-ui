import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/entities';
import { EnvironmentService } from './environment.service';
import { HttpService } from './http.service';
import { LoggerService } from './logger.service';
import { WorkoutAppBaseService } from './workout-app-base.service';

@Injectable({
  providedIn: 'root'
})
export class UserService extends WorkoutAppBaseService {
  public constructor(httpClient: HttpService, environment: EnvironmentService, logger: LoggerService) {
    super(httpClient, environment, logger);
  }

  public getUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.baseUrl}/users?test=true`);
  }

  public getUser(userId: number): Observable<User> {
    return this.httpClient.get<User>(`${this.baseUrl}/users/${userId}`);
  }

  public test(status: number, delay: number = 0, statusAfter: number = 200, per: number = 0): Observable<unknown> {
    return this.httpClient.get<unknown>(
      `${this.baseUrl}/test?status=${status}&delay=${delay}&statusAfter=${statusAfter}&per=${per}`
    );
  }
}
