import { Injectable, EventEmitter } from '@angular/core';

export interface DocsSiteTheme {
  name: string;
  displayName?: string;
  accent: string;
  primary: string;
  isDark?: boolean;
  isDefault?: boolean;
}

@Injectable()
export class ThemeStorage {
  static storageKey = 'docs-theme-storage-current-name';

  onThemeUpdate: EventEmitter<DocsSiteTheme> = new EventEmitter<DocsSiteTheme>();

  storeTheme(theme: DocsSiteTheme): void {
    try {
      window.localStorage[ThemeStorage.storageKey] = theme.name;
    } catch {}

    this.onThemeUpdate.emit(theme);
  }

  getStoredThemeName(): string | null {
    try {
      return window.localStorage[ThemeStorage.storageKey] || null;
    } catch {
      return null;
    }
  }

  clearStorage(): void {
    try {
      window.localStorage.removeItem(ThemeStorage.storageKey);
    } catch {}
  }
}
