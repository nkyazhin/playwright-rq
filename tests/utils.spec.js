const {
  matches,
  searchUrlKeys,
  isPresentQueryParams
} = require('../lib/utils');

describe('mathches', () => {
  it('success find url', () => {
    const urlArray = ['_api/test', '_api/test2', '_api/test3'];
    const url = 'http://localhost:3004/_api/test2/';
    expect(matches(urlArray, url)).toBeTruthy();
  });

  it('unsuccessful find url', () => {
    const urlArray = ['_api/test', '_api/test2', '_api/test3'];
    const url = 'http://localhost:3004/_api/noTest/';
    expect(matches(urlArray, url)).toBeFalsy();
  });
});

describe('searchUrlKeys', () => {
  it('success find urls', () => {
    const urlArray = ['_api/test1', '_api/test2', '_api/test3', '_api/test2_v2'];
    const url = 'http://localhost:3004/_api/test2_v2';
    expect(searchUrlKeys(urlArray, url)).toEqual(['_api/test2', '_api/test2_v2']);
  });

  it('unsuccessful find url', () => {
    const urlArray = ['_api/test', '_api/test2', '_api/test3'];
    const url = 'http://localhost:3004/_api/noTest/';
    expect(searchUrlKeys(urlArray, url)).toEqual([]);
  });
});

describe('isPresentQueryParams', () => {
  it('all params find', () => {
    const url = 'http://localhost:3004/_api/test2?test=true&test2=false&test3=1234';
    const queryParams = {
      test: true,
      test3: 1234,
    };
    expect(isPresentQueryParams(url, queryParams)).toBeTruthy();
  });

  it('all params find', () => {
    const url = 'http://localhost:3004/_api/test2?test=true&test2=false&test3=1234';
    const queryParams = {
      test2: false,
      test3: 1234,
      test5: false
    };
    expect(isPresentQueryParams(url, queryParams)).toBeFalsy();
  });
});
