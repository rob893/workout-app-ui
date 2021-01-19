import { Inject, Injectable } from '@angular/core';
import { ENVIRONMENT } from '../global-providers';
import { Environment } from '../models/core';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService implements Environment {
  private readonly environment: Environment;

  public constructor(@Inject(ENVIRONMENT) environment: Environment) {
    this.environment = environment;
  }

  public get production(): boolean {
    return this.environment.production;
  }

  public get localStoragePrefix(): string {
    return this.environment.localStoragePrefix;
  }

  public get env(): 'development' | 'production' {
    return this.environment.env;
  }

  public get workoutAppBaseUrl(): string {
    return this.environment.workoutAppBaseUrl;
  }

  public get allowedHosts(): string[] {
    return [...this.environment.allowedHosts];
  }

  public get googleAuthClientId(): string {
    return this.environment.googleAuthClientId;
  }
}
