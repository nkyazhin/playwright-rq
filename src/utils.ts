import * as fs from 'fs';
import path from 'path';
import { URL } from 'url';
import debug from 'debug';
import isMatch from 'lodash.ismatch';
import { DEFAULT_OPTIONS, DEFAULT_RESPONSE } from './consts';
import {
  InterceptList,
  InterceptParams,
  MockList,
  Options,
  PlaywrightRequest,
  URLMatch,
  UserOptions,
} from './types';

const loggerRead = debug('playwright-rq:readFile');

export const userMockListToInterceptList = (mockList: MockList): InterceptList => {
  const interceptList = {};
  return Object.keys(mockList).reduce((acc, key) => {
    const mock = mockList[key];
    return {
      ...acc,
      [key]: {
        name: key,
        url: mock.url,
        method: mock.method.toLowerCase(),
        queryParams: mock.queryParams,
        bodyParams: mock.bodyParams,
        response: { ...DEFAULT_RESPONSE, ...mock.response },
      },
    };
  }, interceptList);
};

export const userOptionsToOptions = (userOptions: UserOptions): Options => {
  const { mockList, page, ...otherOptions } = userOptions;
  return {
    ...DEFAULT_OPTIONS,
    ...otherOptions,
    interceptList: userMockListToInterceptList(mockList),
  };
};

export const findInterceptor = (
  interceptList: InterceptList,
  request: PlaywrightRequest,
): InterceptParams | undefined => {
  const interceptorKey = Object.keys(interceptList).find((key) => {
    const interceptor = interceptList[key];
    if (!urlMatches(request.url, interceptor.url)) {
      return false;
    }
    if (request.method.toLowerCase() !== interceptor.method) {
      return false;
    }
    if (!isPresentQueryParams(request.url, interceptor.queryParams)) {
      return false;
    }
    if (!isPresentBodyParams(request.body, interceptor.bodyParams)) {
      return false;
    }
    return interceptor;
  });
  if (!interceptorKey) {
    return;
  }
  return interceptList[interceptorKey];
};

export const urlMatches = (urlString: string, match: URLMatch | undefined): boolean => {
  if (match === undefined || match === '') {
    return true;
  }
  if (typeof match === 'string') {
    return urlString.includes(match);
  }
  return match.test(urlString);
};

export const isInterceptRequestType = (
  interceptType: Set<string>,
  resourceType: string,
): boolean => {
  return interceptType.has(resourceType);
};

const isPresentBodyParams = (
  body: string | null,
  bodyParams: Record<string, any> | undefined,
): boolean => {
  if (bodyParams === undefined) {
    return true;
  }
  if (!body) {
    return false;
  }
  const postData = JSON.parse(body);
  return postData && isMatch(postData, bodyParams);
};

export const isPresentQueryParams = (
  url: string,
  queryParams: Record<string, string> | undefined,
): boolean => {
  if (queryParams === undefined) {
    return true;
  }
  const requestUrl = new URL(url);
  return Object.keys(queryParams).every(
    (key) => queryParams[key] === requestUrl.searchParams.get(key),
  );
};

export const getFileName = (rootDir: string, filePath: string): string => {
  return path.resolve(process.cwd(), rootDir, filePath);
};

export const readFile = (fileName: string): string => {
  try {
    loggerRead(`>> readFile(): ${fileName}`);
    return fs.readFileSync(fileName, 'utf8');
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      loggerRead(`fail to read the file (ENOENT) ${fileName}`, error.message);
    } else {
      loggerRead(`fail to read the file ${fileName} for some other reason`, error);
    }

    throw error;
  }
};
