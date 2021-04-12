const path = require('path');
const debug = require('debug');
const {searchUrlKeys, shouldNotIntercept, isPresentQueryParams, getMockParamsByData} = require('./utils');
const {fy} = require('./logger');
const storage = require('./storage');

const logger = debug('prm:-request');
const defaultHeaders = {
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
};

function interceptType(route, request, ci) {
  const abortType = ['xhr', 'fetch'];
  if (abortType.includes(request.resourceType()) && ci) {
    logger('» shouldNotIntercept. Aborted. interceptedRequest.abort().');
    route.abort();
  } else {
    logger('» shouldNotIntercept. Skipping. interceptedRequest.continue().');
    route.continue();
  }
}

module.exports = function createHandler(params) {
  const {reqSet, workDir, mockList, verbose, ci} = params;

  logger('Creating request handler');

  return function handleRequest(route, interceptedRequest) {
    const url = interceptedRequest.url();
    const method = interceptedRequest.method().toUpperCase();
    const postData = interceptedRequest.postData();
    const headers = interceptedRequest.headers();
    const reqParams = {url, method, postData};
    let responseHeaders = defaultHeaders;
    let mockPath;
    let responseBody;
    let mockFound = false;

    logger(`» Intercepted request with method "${method}" and url "${url}"`);

    if (verbose) {
      console.log(`Request handling for:\n${fy(reqParams)}`);
      console.log(`Request headers :\n${fy(headers)}`);
      console.log('handleRequest', interceptedRequest);
      console.log('decodeURIComponent(postData)', decodeURIComponent(postData));
      console.log('encodeURIComponent(postData)', encodeURIComponent(postData));
    }

    if (shouldNotIntercept(mockList, url)) {
      interceptType(route, interceptedRequest, ci);
      return;
    }

    const urlKeys = searchUrlKeys(Object.keys(mockList), url);
    for (let i = 0; i < urlKeys.length; i++) {
      const urlKey = urlKeys[i];
      const mockParams = mockList[urlKey];

      if (typeof mockParams === 'object') {
        if (!mockParams[method]) {
          continue;
        }

        //const methodMockParams = mockParams[method];
        const methodMockParams = getMockParamsByData(mockParams[method], postData);

        if (typeof methodMockParams === 'object') {

          if (methodMockParams.queryParams && !isPresentQueryParams(url, methodMockParams.queryParams)) {
            continue;
          }
          if (methodMockParams.body) {
            responseBody = methodMockParams.body;
          } else {
            if (!methodMockParams.filePath) {
              throw new Error(`Object has no field 'filePath' and 'body'. Add one of these fields. Url: ${urlKey}, method: ${method}`);
            }
            mockPath = methodMockParams.filePath
          }

          if (methodMockParams.headers) {
            if (typeof methodMockParams.headers !== 'object') {
              throw new Error(`Headers params is not a object. Url: ${urlKey}, method: ${method}`);
            }
            responseHeaders = Object.assign({}, responseHeaders, methodMockParams.headers)
          }

        } else {
          mockPath = methodMockParams;
        }
      } else {
        mockPath = mockParams;
      }
      mockFound = true;
      break;
    }

    if (!mockFound) {
      interceptType(route, interceptedRequest, ci);
      return;
    }

    if (responseBody) {
      route.fulfill({
        headers: responseHeaders,
        body: responseBody,
      });
      return;
    }

    const mock_params = {
      mockPath,
      workDir,
    };

    const fn = storage.name(mock_params);

    params._onReqStarted();
    reqSet.add(fn);
    debug('prm:connections:add')(path.basename(fn), Array.from(reqSet).map((f) => path.basename(f)));
    logger(`» Trying to read from file ${fn}`);

    storage
      .read(fn)
      .then((data) => {
        const r_data = data.replace(/(?:\r)/g, '');
        const body = r_data.substring(r_data.indexOf('\n\n') + 2);

        logger(`« Successfully read from file. Body starts with ${body.substr(0, 100)}`);

        route.fulfill({
          headers: responseHeaders,
          body,
        });
      })
      .catch((e) => {
        logger(`« Failed to read: ${e.fn}`);
        logger(`« Mock not found in CI mode! Rejecting. "${e.fn}" ${url}`);
        params._onReqsReject(`Failed to read: ${e.fn}`);
      })
  }
};
