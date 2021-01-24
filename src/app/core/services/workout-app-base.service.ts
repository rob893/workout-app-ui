import { EnvironmentService } from './environment.service';
import { HttpService } from './http.service';
import { LoggerService } from './logger.service';

export abstract class WorkoutAppBaseService {
  protected readonly logger: LoggerService;

  protected readonly environment: EnvironmentService;

  protected readonly httpClient: HttpService;

  protected readonly baseUrl: string;

  public constructor(httpClient: HttpService, environment: EnvironmentService, logger: LoggerService) {
    this.logger = logger;
    this.environment = environment;
    this.httpClient = httpClient;

    this.baseUrl = environment.workoutAppBaseUrl;
  }
}
