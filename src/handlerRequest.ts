import { Request, Route } from '@playwright/test';
import debug from 'debug';
import { Options, PlaywrightRequest, Response } from './types';
import { findInterceptor, getFileName, isInterceptRequestType, readFile } from './utils';

const logger = debug('playwright-rq:handleRequest');

const prepareResponse = (response: Response, rootDir: string) => {
  let fileData = null;
  if (response.filePath) {
    const fileName = getFileName(rootDir, response.filePath);
    fileData = readFile(fileName);
  }

  return {
    status: response.status,
    headers: response.headers,
    body: fileData ? fileData : response.body,
  };
};

export const createHandler = (options: Options) => {
  return (route: Route, request: Request): void => {
    const { ci, interceptType, interceptList, rootDir } = options;
    const pwRequest: PlaywrightRequest = {
      url: request.url(),
      method: request.method(),
      resourceType: request.resourceType(),
      body: request.postData(),
    };
    logger(`URL: ${pwRequest.url} | METHOD: ${pwRequest.method} | TYPE: ${pwRequest.resourceType}`);

    if (!isInterceptRequestType(interceptType, pwRequest.resourceType)) {
      logger(`>> continue(), because interceptType === ${[...interceptType].join(' ')}`);
      route.continue();
      return;
    }
    const interceptor = findInterceptor(interceptList, pwRequest);

    if (!interceptor) {
      if (ci) {
        logger('>> abort(), because could not find interceptor and ci === true');
        route.abort();
        return;
      }
      logger('>> continue(), because could not find interceptor');
      route.continue();
      return;
    }

    const pwResponse = prepareResponse(interceptor.response, rootDir);
    logger(`>> fulfill() by interceptor: ${interceptor.name}`);
    logger(`>> fulfill() response: ${JSON.stringify(pwResponse)}`);
    route.fulfill(pwResponse);
  };
};
