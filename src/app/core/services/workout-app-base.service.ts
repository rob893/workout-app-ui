import { HttpClient } from '@angular/common/http';
import { EnvironmentService } from './environment.service';
import { LoggerService } from './logger.service';

export abstract class WorkoutAppBaseService {
  protected readonly logger: LoggerService;

  protected readonly environment: EnvironmentService;

  protected readonly httpClient: HttpClient;

  protected readonly baseUrl: string;

  public constructor(httpClient: HttpClient, environment: EnvironmentService, logger: LoggerService) {
    this.logger = logger;
    this.environment = environment;
    this.httpClient = httpClient;

    this.baseUrl = environment.workoutAppBaseUrl;
  }
}
