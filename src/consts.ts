import { Response } from './types';

export const DEFAULT_OPTIONS = {
  rootDir: '__remocks__',
  interceptType: new Set(['xhr', 'fetch']),
  ci: false,
  interceptList: {},
};

export const DEFAULT_RESPONSE: Response = {
  status: 200,
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
  },
};
