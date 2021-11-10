import { expect, test } from '@playwright/test';
import { DEFAULT_RESPONSE } from '../src/consts';
import { findInterceptor } from '../src/utils';

test.describe('Find interceptor', () => {
  const pwRequest = {
    url: 'http://localhost:8080/test/api?test=1234&mock=3',
    method: 'post',
    resourceType: 'fetch',
    body: '{"title":"mock_response","test":"123456"}',
  };

  test.describe('success', () => {
    test('with regExp url', () => {
      const interceptParams = {
        name: 'test',
        url: /test\/api/,
        method: pwRequest.method,
        queryParams: { test: '1234' },
        response: {
          ...DEFAULT_RESPONSE,
        },
      };
      expect(findInterceptor({ test: interceptParams }, pwRequest)).toEqual(interceptParams);
    });

    test('with query params', () => {
      const interceptParams = {
        name: 'test',
        url: 'test/api',
        method: pwRequest.method,
        queryParams: { test: '1234' },
        response: {
          ...DEFAULT_RESPONSE,
        },
      };
      expect(findInterceptor({ test: interceptParams }, pwRequest)).toEqual(interceptParams);
    });

    test('with body params', () => {
      const interceptParams = {
        name: 'test',
        url: 'test/api',
        method: pwRequest.method,
        bodyParams: { test: '123456' },
        response: {
          ...DEFAULT_RESPONSE,
        },
      };
      expect(findInterceptor({ test: interceptParams }, pwRequest)).toEqual(interceptParams);
    });
  });

  test.describe('error', () => {
    test('when other string url', () => {
      const interceptParams = {
        name: 'test',
        url: 'test/api12345',
        method: pwRequest.method,
        response: {
          ...DEFAULT_RESPONSE,
        },
      };
      expect(findInterceptor({ test: interceptParams }, pwRequest)).toBeUndefined();
    });

    test('when other regExp url', () => {
      const interceptParams = {
        name: 'test',
        url: /test\/api1234556/,
        method: pwRequest.method,
        response: {
          ...DEFAULT_RESPONSE,
        },
      };
      expect(findInterceptor({ test: interceptParams }, pwRequest)).toBeUndefined();
    });

    test('when other method', () => {
      const interceptParams = {
        name: 'test',
        url: 'test/api',
        method: 'get',
        response: {
          ...DEFAULT_RESPONSE,
        },
      };
      expect(findInterceptor({ test: interceptParams }, pwRequest)).toBeUndefined();
    });

    test('when other query params', () => {
      const interceptParams = {
        name: 'test',
        url: 'test/api',
        method: pwRequest.method,
        queryParams: { mocker: 'test' },
        response: {
          ...DEFAULT_RESPONSE,
        },
      };
      expect(findInterceptor({ test: interceptParams }, pwRequest)).toBeUndefined();
    });

    test('when other body params', () => {
      const interceptParams = {
        name: 'test',
        url: 'test/api',
        method: pwRequest.method,
        bodyParams: { mocker: 'test' },
        response: {
          ...DEFAULT_RESPONSE,
        },
      };
      expect(findInterceptor({ test: interceptParams }, pwRequest)).toBeUndefined();
    });
  });
});
