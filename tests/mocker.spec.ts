import { expect, test } from '@playwright/test';
import { Mocker } from '../src';

test.describe('Mocker', () => {
  const mocker = new Mocker();
  const body = '{"title":"mock_response"}';
  const mockList = {
    test: {
      url: 'http://localhost:3000/api',
      method: 'GET',
      response: {},
    },
  };

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test.describe('success mock response', () => {
    test('after double start', async ({ page }) => {
      mockList.test.response = {
        body,
      };
      await mocker.start({
        page,
        mockList,
      });
      await mocker.start({
        page,
        mockList,
      });
      await page.click('#button');
      await expect(page.locator('.response-body')).toHaveText(body);
      await mocker.stop();
    });

    test('with browserContext', async ({ page, context }) => {
      mockList.test.response = {
        body,
      };
      await mocker.start({
        page: context,
        mockList,
      });
      await page.click('#button');
      await expect(page.locator('.response-body')).toHaveText(body);
      await expect(page.locator('.response-headers')).toHaveText('application/json; charset=UTF-8');
      await expect(page.locator('.response-code')).toHaveText('200');
      await mocker.stop();
    });

    test('without response', async ({ page }) => {
      await mocker.start({
        page,
        mockList: {
          test: {
            url: 'http://localhost:3000/api',
            method: 'GET',
          },
        },
      });
      await page.click('#button');
      await expect(page.locator('.response-body')).toHaveText('{}');
      await expect(page.locator('.response-headers')).toHaveText('application/json; charset=UTF-8');
      await expect(page.locator('.response-code')).toHaveText('200');
      await mocker.stop();
    });

    test('with body', async ({ page }) => {
      mockList.test.response = {
        body,
      };
      await mocker.start({
        page,
        mockList,
      });
      await page.click('#button');
      await expect(page.locator('.response-body')).toHaveText(body);
      await expect(page.locator('.response-headers')).toHaveText('application/json; charset=UTF-8');
      await expect(page.locator('.response-code')).toHaveText('200');
      await mocker.stop();
    });

    test('with status', async ({ page }) => {
      mockList.test.response = {
        body,
        status: 201,
      };
      await mocker.start({
        page,
        mockList,
      });
      await page.click('#button');
      await expect(page.locator('.response-body')).toHaveText(body);
      await expect(page.locator('.response-headers')).toHaveText('application/json; charset=UTF-8');
      await expect(page.locator('.response-code')).toHaveText('201');
      await mocker.stop();
    });

    test('with headers', async ({ page }) => {
      mockList.test.response = {
        body,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
      };
      await mocker.start({
        page,
        mockList,
      });
      await page.click('#button');
      await expect(page.locator('.response-body')).toHaveText(body);
      await expect(page.locator('.response-headers')).toHaveText('text/html; charset=utf-8');
      await expect(page.locator('.response-code')).toHaveText('200');
      await mocker.stop();
    });

    test('with file', async ({ page }) => {
      mockList.test.response = {
        filePath: 'get_api',
      };
      await mocker.start({
        page,
        mockList,
        rootDir: 'tests/__remocks__',
      });
      await page.click('#button');
      await expect(page.locator('.response-body')).toHaveText(body);
      await expect(page.locator('.response-headers')).toHaveText('application/json; charset=UTF-8');
      await expect(page.locator('.response-code')).toHaveText('200');
      await mocker.stop();
    });

    test('after update params', async ({ page }) => {
      const newMockList = {
        test: {
          url: 'http://localhost:3000/test',
          method: 'GET',
          response: {},
        },
      };
      await mocker.start({
        page,
        mockList: newMockList,
      });
      await page.click('#button');
      await expect(page.locator('.response-body')).toHaveText('{"title":"response"}');
      mockList.test.response = {
        body,
      };
      mocker.update(mockList);
      await page.click('#button');
      await expect(page.locator('.response-body')).toHaveText(body);
      await mocker.stop();
    });
  });

  test('update() return error if Mocker not started', () => {
    expect(() => mocker.update(mockList)).toThrow('Mocker is not started!');
  });

  test('stop() return error if Mocker not started', async () => {
    await expect(mocker.stop()).rejects.toThrow('Mocker is not started!');
  });
});
