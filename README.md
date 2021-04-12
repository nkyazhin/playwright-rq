playwright-rq
=========
[![NPM version](https://img.shields.io/npm/v/playwright-rq.svg)](https://www.npmjs.com/package/playwright-rq)
[![NPM Downloads](https://img.shields.io/npm/dm/playwright-rq.svg?style=flat)](https://www.npmjs.org/package/playwright-rq)

If you are writing playwright tests, and you want to mock your network responses easily – then this package will help you.
## Getting Started
### Installing
To use "Playwright-rq" in your project, run:
```
npm i --save-dev playwright-rq
```
### Usage
```js
// first you need to import the package
import mocker from 'playwright-rq';
// start mocker with params
await mocker.start(options);

// and stop mocker after test run
await mocker.stop();
//Both `mocker.start()` and `mocker.stop()` return a `Promise`.
```
You could use `options`
```js
const options = {
  // playwright page
  page: page,
  // default namespace: '__remocks__'
  namespace: 'mockDirPath',
  mockList: {
    '_api/method': 'mockFilePath',
    '_api/method2': {
      GET: 'getMockFilePath',
      POST: 'postMockFilePath'
    },
    '_api/method3': {
      GET: {
        body: 'response',
        queryParams: {
          test: '123'
        }
      }
    },
    '_api/method4': {
      GET: {
        body: 'response',
        headers: {
          'Content-Type': 'application/json'
        }
      },
      POST: {
        filePath: 'postMockFilePath',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    },
    '_api/method5': {
      POST: {
        complex: [
          {
            filePath: "get_api",
            requestBody: {
              test: 'value_1',
              param: 'value'
            }
          },
          {
            filePath: "get_api_2",
            requestBody: {
              test: 'value_2',
              param: 'value'
            }
          }
        ]
      }
    }
  },
  // default: false
  // interruption of requests that are not in mockList and request.resourceType() == 'xhr' or 'fetch'
  ci: true
}
```

