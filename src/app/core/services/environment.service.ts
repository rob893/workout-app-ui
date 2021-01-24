import { Inject, Injectable } from '@angular/core';
import { ENVIRONMENT } from '../global-providers';
import { Environment, LogLevel } from '../models/core';

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

  public get logLevel(): LogLevel {
    return this.environment.logLevel;
  }

  public get clientSideLoggingEnabled(): boolean {
    return this.environment.clientSideLoggingEnabled;
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

  public get anonymousUrls(): (string | RegExp)[] {
    return [...this.environment.anonymousUrls];
  }

  public get allowedHosts(): string[] {
    return [...this.environment.allowedHosts];
  }

  public get googleAuthClientId(): string {
    return this.environment.googleAuthClientId;
  }
}
