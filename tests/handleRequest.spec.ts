import { expect, test } from '@playwright/test';
import { Mocker } from '../src';

test.describe('Handle Request', () => {
  const mocker = new Mocker();
  const mockList = {
    test: {
      url: 'http://localhost:3000/api',
      method: 'GET',
      response: {
        body: '{"title":"mock_response"}',
      },
    },
  };

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('route continue when request has other resourceType', async ({ page }) => {
    await mocker.start({
      page,
      mockList,
      interceptType: new Set(['image']),
    });
    await page.click('#button');
    await expect(page.locator('.response-body')).toHaveText('{"title":"response"}');
    await mocker.stop();
  });

  test('route continue when not find interceptor', async ({ page }) => {
    mockList.test.method = 'POST';
    await mocker.start({
      page,
      mockList,
    });
    await page.click('#button');
    await expect(page.locator('.response-body')).toHaveText('{"title":"response"}');
    await mocker.stop();
  });

  test('route abort when not find interceptor and include ci option', async ({ page }) => {
    mockList.test.method = 'POST';
    await mocker.start({
      page,
      mockList,
      ci: true,
    });
    await page.click('#button');
    await expect(page.locator('.response-body')).toHaveText('error');
    await mocker.stop();
  });
});
