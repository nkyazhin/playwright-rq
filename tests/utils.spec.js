const {
  matches,
  searchUrlKeys,
  isPresentQueryParams,
  getMockParamsByData
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

describe('getMockParamsByData', () => {
  const postData = '{"a": {"c": 3}}';

  it('without complex params', () => {
    const mockParams = {
      body: 'response',
      headers: {
        'Content-Type': 'application/json'
      }
    }
    expect(getMockParamsByData(mockParams, postData)).toEqual(mockParams);
  });

  it('with success complex params', () => {
    const mockParams = {
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
            a: {
              c: 3
            }
          }
        }
      ]
    }
    expect(getMockParamsByData(mockParams, postData)).toBe('get_api_2');
  });

  it('not find complex params', () => {
    const mockParams = {
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
            test: 'value_1',
            param: 'value'
          }
        }
      ]
    }
    expect(() => {
      getMockParamsByData(mockParams, postData)
    }).toThrow("Can't find any filePath route for requestBody params");
  });

  it('not find filePath field', () => {
    const mockParams = {
      complex: [
        {
          filePath: "get_api",
          requestBody: {
            test: 'value_1',
            param: 'value'
          }
        },
        {
          requestBody: {
            a: {
              c: 3
            }
          }
        }
      ]
    }
    expect(() => {
      getMockParamsByData(mockParams, postData)
    }).toThrow("Can't find any filePath route for requestBody params");
  });
});
