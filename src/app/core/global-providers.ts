import { InjectionToken } from '@angular/core';
import { environment } from '../../environments/environment';
import { Environment, Logger } from '../models/core';

export const BROWSER_STORAGE = new InjectionToken<Storage>('Browser Storage', {
  providedIn: 'root',
  factory: () => localStorage
});

export const LOGGER = new InjectionToken<Logger>('Logger', {
  providedIn: 'root',
  factory: () => console
});

export const ENVIRONMENT = new InjectionToken<Environment>('Environment', {
  providedIn: 'root',
  factory: () => environment
});
