import { Request } from '@playwright/test';
import { URLMatch } from './types';
import { isPresentQueryParams, urlMatches } from './utils';

export const searchRequest = (options: {
  url: URLMatch;
  results: Request[];
  queryParams?: Record<string, string>;
}) => {
  const { url, results, queryParams } = options;
  return (request: Request) => {
    const requestUrl = request.url();

    if (!urlMatches(requestUrl, url)) {
      return;
    }
    if (!isPresentQueryParams(requestUrl, queryParams)) {
      return;
    }
    results.push(request);
  };
};

export class TimeoutError extends Error {}

const check = (
  fn: () => boolean,
  timeStart: number,
  timeout: number,
  resolve: () => void,
  reject: any,
) => {
  setTimeout(() => {
    if (fn()) {
      resolve();
      return;
    }

    if (Date.now() - timeStart > timeout) {
      reject(
        new TimeoutError(`waitFor timeout - provided function did not return true in ${timeout}ms`),
      );
      return;
    }

    check(fn, timeStart, timeout, resolve, reject);
  }, 10);
};

export const waitFor = (fn: () => boolean, timeout = 100): Promise<void> => {
  const timeStart = Date.now();
  return new Promise((resolve, reject) => check(fn, timeStart, timeout, resolve, reject));
};
