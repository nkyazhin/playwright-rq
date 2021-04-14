const _ = require('lodash')

const {URL} = require('url');

const matches = (arr, str) => !!arr.find((el) => str.includes(el));
const searchUrlKeys = (arr, str) => arr.filter(el => str.includes(el));

const isPresentQueryParams = (url, queryParams) => {
  const urlRequest = new URL(url);
  return Object.keys(queryParams).every(
    key => {
      if (!urlRequest.searchParams.has(key)) {
        return false
      }
      return queryParams[key].toString() === urlRequest.searchParams.get(key).toString()
    }
  );
};

const getMockParamsByData = (params, postData) => {
  let result;
  if (!params.complex) {
    return params;
  }
  result = params.complex.find((el) => _.isEqual(el.requestBody, JSON.parse(postData)));
  if (!(result && result.filePath)) {
    throw new Error("Can't find any filePath route for requestBody params");
  }
  return result.filePath;
};

const shouldNotIntercept = (mockList = {}, url = '') => {
  const mockListKeys = Object.keys(mockList);
  const inMockList = matches(mockListKeys, url);


  return !inMockList
};

module.exports = {
  matches,
  shouldNotIntercept,
  searchUrlKeys,
  isPresentQueryParams,
  getMockParamsByData
};
