import { expect, test } from '@playwright/test';
import { RequestListener } from '../src';

test.describe('Request listener', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('search request by string url', async ({ page }) => {
    const requestListener = new RequestListener({ page, url: 'http://localhost:3000/api' });
    await page.click('#button');
    const request = await requestListener.waitForRequest();
    expect(request).toBeTruthy();
  });

  test('search request by string regExp', async ({ page }) => {
    const requestListener = new RequestListener({ page, url: /api/ });
    await page.click('#button');
    const request = await requestListener.waitForRequest();
    expect(request).toBeTruthy();
  });

  test('search request by url and queryParams', async ({ page }) => {
    const requestListener = new RequestListener({
      page,
      url: 'http://localhost:3000/api',
      queryParams: { test: '123' },
    });
    await page.click('#button');
    const request = await requestListener.waitForRequest();
    expect(request).toBeTruthy();
  });

  test('check request count and reload', async ({ page }) => {
    const requestListener = new RequestListener({
      page,
      url: 'http://localhost:3000/api',
    });
    await page.click('#button');
    await page.click('#button');
    await requestListener.waitForRequest();
    expect(requestListener.requests.length).toBe(2);
    requestListener.reload();
    expect(requestListener.requests.length).toBe(0);
  });

  test('return error if not find request', async ({ page }) => {
    const timeout = 100;
    const url = 'http://localhost:3000/api';
    const requestListener = new RequestListener({ page, url });
    await expect(requestListener.waitForRequest(timeout)).rejects.toThrow(
      `Request "${url}" not found, after ${timeout}ms`,
    );
  });
});
