import { Page, Request } from '@playwright/test';
import { searchRequest, TimeoutError, waitFor } from './searchRequst';
import { RequestListenerOptions, URLMatch } from './types';

class RequestListener {
  readonly requests: Request[];
  private page: Page;
  private url: URLMatch;
  private queryParams: Record<string, string> | undefined;

  constructor(options: RequestListenerOptions) {
    this.page = options.page;
    this.url = options.url;
    this.queryParams = options.queryParams;
    this.requests = [];

    this.page.on(
      'request',
      searchRequest({ url: this.url, results: this.requests, queryParams: this.queryParams }),
    );
  }

  public async waitForRequest(timeout = 1000): Promise<Request> {
    try {
      await waitFor(() => !!this.requests[0], timeout);
    } catch (e) {
      if (e instanceof TimeoutError) {
        throw new Error(`Request ${this.prettyMsg()} not found, after ${timeout}ms`);
      }
      throw e;
    }
    return this.requests[0];
  }

  public reload(): void {
    this.requests.length = 0;
  }

  private prettyMsg(): string {
    const stringURL = this.url instanceof RegExp ? this.url.toString() : this.url;
    return this.queryParams
      ? `"${stringURL}" with queryParams: ${JSON.stringify(this.queryParams)}`
      : `"${stringURL}"`;
  }
}

export default RequestListener;
