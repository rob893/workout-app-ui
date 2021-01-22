import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/entities';
import { EnvironmentService } from './environment.service';
import { LoggerService } from './logger.service';
import { WorkoutAppBaseService } from './workout-app-base.service';

@Injectable({
  providedIn: 'root'
})
export class UserService extends WorkoutAppBaseService {
  public constructor(httpClient: HttpClient, environment: EnvironmentService, logger: LoggerService) {
    super(httpClient, environment, logger);
  }

  public getUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.baseUrl}/users`);
  }
}
