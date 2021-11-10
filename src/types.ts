import { BrowserContext, Page } from '@playwright/test';

export type InterceptList = Record<string, InterceptParams>;

export type MockList = Record<string, RequestParams>;

export type URLMatch = string | RegExp;

export interface Options {
  rootDir: string;
  interceptType: Set<string>;
  interceptList: InterceptList;
  ci: boolean;
}

export interface UserOptions {
  page: Page | BrowserContext;
  mockList: MockList;
  rootDir?: string;
  interceptType?: Set<string>;
  ci?: boolean;
}

export interface RequestListenerOptions {
  page: Page;
  url: URLMatch;
  queryParams?: Record<string, string>;
}

interface RequestParams {
  url: URLMatch;
  method: string;
  queryParams?: Record<string, string>;
  bodyParams?: Record<string, any>;
  response?: UserResponse;
}

export interface InterceptParams extends RequestParams {
  name: string;
  response: Response;
}

export interface Response {
  status: number;
  headers: Record<string, string>;
  body?: string;
  filePath?: string;
}

interface UserResponse {
  status?: number;
  headers?: Record<string, string>;
  body?: string;
  filePath?: string;
}

export interface PlaywrightRequest {
  url: string;
  method: string;
  resourceType: string;
  body: string | null;
}
