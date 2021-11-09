# playwright-rq

[![NPM version](https://img.shields.io/npm/v/playwright-rq.svg)](https://www.npmjs.com/package/playwright-rq)
[![NPM Downloads](https://img.shields.io/npm/dm/playwright-rq.svg?style=flat)](https://www.npmjs.org/package/playwright-rq)

If you are using playwright, and you need mock your network responses, then playwright-rq will help you!

## Installing

```
npm i --save-dev playwright-rq
```

## Usage
### Mocker

Allows you to mock for your network responses.
```ts
import { Mocker } from 'playwright-rq';
const mocker = new Mocker();
// start mocker with options
await mocker.start({
  page,
  mockList: {
    test: {
      url: 'http://localhost:3000/api',
      method: 'GET',
      response: {
        body: 'test',
        status: 200,
      },
    },
  },
});
// update mocker params
mocker.update({
  test: {
    url: 'http://localhost:3000/api',
    method: 'GET',
    response: {
      body: 'test',
      status: 200,
    },
  },
});

// stop mocker
await mocker.stop();
```

#### start options

```ts
const options = {
  // playwright page
  page: Page,
  // Indicates where are mocks. Default rootDir = '__remocks__'
  // Absolute path = path.resolve(process.cwd(), rootDir)
  rootDir: 'test/__remocks__',
  // If interceptType does not contain playwright request.resourceType(),
  // then call route.continue()
  // Default interceptType = new Set(['xhr', 'fetch'])
  interceptType: new Set(['xhr', 'image']),
  // If could not find mock for request,
  // and ci = true, then call route.abort(). 
  // Default ci = false
  ci: true,
  // mockList = Record<string, RequestParams>
  // interface RequestParams {
  //   url: string | RegExp;
  //   method: string;
  //   queryParams?: Record<string, string>;
  //   bodyParams?: Record<string, any>;
  //   resopnse?: {
  //     status?: number;
  //     headers?: Record<string, string>;
  //     body?: string;
  //     filePath?: string;
  //   }
  // }
  // Default resopnse = {
  //   status: 200,
  //   headers: {
  //     'Content-Type': 'application/json; charset=UTF-8',
  //   }, 
  // }
  mockList: {
    mockName: {
      url: '/api/test',
      method: 'post',
      resopnse: {
        body: '{test:"1234"}',
      }
    },
    test: {
      url: /api\/test/,
      method: 'get',
      queryParams: {
        abst: '1234'
      },
      response: {
        status: 200,
        filePath: 'test'
      },
    },
    mockParams: {
      url: /api\/test/,
      method: 'get',
      bodyParams: {
        abst: '1234'
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
        body: "text"
      },
    },
  },
};
```
#### update options

Updates mockList which you added to `mocker.statrt()`.
If a mock with such a key already exists, it is updated, otherwise it adds.
```ts
mocker.update({
  test: {
    url: 'http://localhost:3000/api',
    method: 'GET',
    response: {
      body: 'test',
      status: 200,
    },
  },
});
```

### RequestListener
Allows you to wait for a request, and return [Playwright Request](https://playwright.dev/docs/api/class-request) object.
```ts
import { RequestListener } from 'playwright-rq';
// start listener for request
const requestListener = new RequestListener({ page, url: 'http://localhost:3000/api' });
await page.click('#button');
// wait request. Dafault timetout = 1000
const request = await requestListener.waitForRequest(3000);
expect(request.postDataJSON()).toEqual({ test: '1234' });
```
If the request is not found after the specified timeout, then we get an error: `Request "${url}" not found, after ${timeout}ms`

## Debug

`playwright-rq` uses `debug` package for logs.
Example: `DEBUG=playwright-rq* npm run test`
