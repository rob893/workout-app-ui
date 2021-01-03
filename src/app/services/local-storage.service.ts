import { Inject, Injectable } from '@angular/core';
import { BROWSER_STORAGE } from '../core/global-providers';
import { EnvironmentService } from './environment.service';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  @Inject(BROWSER_STORAGE)
  private readonly storage: Storage;

  private readonly storagePrefix: string;

  public constructor(storage: Storage, { localStoragePrefix, env }: EnvironmentService) {
    this.storage = storage;
    this.storagePrefix = `${localStoragePrefix}-${env}-`;
  }

  public getItem(key: string): string | null {
    const item = this.storage.getItem(this.computeKey(key));

    if (!item) {
      return null;
    }

    return item;
  }

  public getParsedItem<T extends Record<keyof T, unknown> | unknown[]>(key: string): T | null {
    const item = this.getItem(key);

    if (!item) {
      return null;
    }

    const parsed = JSON.parse(item);

    return parsed;
  }

  public setItem<T>(key: string, value: T): void {
    if (typeof value === 'string') {
      this.storage.setItem(this.computeKey(key), value);
    } else {
      const asString = JSON.stringify(value);
      this.storage.setItem(this.computeKey(key), asString);
    }
  }

  public removeItem(key: string): void {
    this.storage.removeItem(this.computeKey(key));
  }

  public clear(): void {
    this.storage.clear();
  }

  private computeKey(key: string): string {
    return `${this.storagePrefix}${key}`;
  }
}
