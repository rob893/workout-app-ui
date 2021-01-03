import { Inject, Injectable } from '@angular/core';
import { ENVIRONMENT } from '../core/global-providers';
import { Environment } from '../models/core';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService implements Environment {
  @Inject(ENVIRONMENT)
  private readonly environment: Environment;

  public constructor(environment: Environment) {
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
}
