export interface Environment {
  production: boolean;
  env: 'development' | 'production';
  localStoragePrefix: string;
}

export interface Logger {
  debug(...args: any[]): void;
  info(...args: any[]): void;
  warn(...args: any[]): void;
  error(...args: any[]): void;
}
