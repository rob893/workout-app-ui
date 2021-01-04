export interface Environment {
  production: boolean;
  env: 'development' | 'production';
  localStoragePrefix: string;
  workoutAppBaseUrl: string;
}

export interface Logger {
  debug(...args: any[]): void;
  info(...args: any[]): void;
  warn(...args: any[]): void;
  error(...args: any[]): void;
}

export type JSONPrimitive = string | number | boolean | null;

export type JSONArray = (JSONObject | JSONArray | JSONPrimitive)[];

export type JSONObject = {
  [key: string]: JSONObject | JSONPrimitive | JSONArray;
};

export interface CursorPaginatedResponse<TEntity> {
  edges: CursorPaginatedResponseEdge<TEntity>;
  nodes: TEntity[];
  pageInfo: CursorPaginatedResponsePageInfo;
  totalCount?: number;
}

export interface CursorPaginatedResponseEdge<TEntity> {
  cursor: string;
  node: TEntity;
}

export interface CursorPaginatedResponsePageInfo {
  startCursor: string | null;
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface JSONPatchDocument {
  op: 'add' | 'replace';
  path: string;
  value: JSONObject | JSONArray | JSONPrimitive;
}

export interface Indexable<TValue = any> {
  [key: string]: TValue;
}

export enum HttpVerb {
  Get = 'GET',
  Post = 'POST',
  Patch = 'PATCH',
  Delete = 'DELETE',
  Put = 'PUT',
  Options = 'OPTIONS'
}
