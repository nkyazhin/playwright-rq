const { URL } = require('url');

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

const shouldNotIntercept = (mockList = {}, url = '') => {
  const mockListKeys = Object.keys(mockList);
  const inMockList = matches(mockListKeys, url);


  return !inMockList
};

module.exports = {
  matches,
  shouldNotIntercept,
  searchUrlKeys,
  isPresentQueryParams
};
