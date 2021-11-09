import { BrowserContext, Page, Request, Route } from '@playwright/test';
import debug from 'debug';
import { DEFAULT_OPTIONS } from './consts';
import { createHandler } from './handlerRequest';
import { MockList, Options, UserOptions } from './types';
import { userMockListToInterceptList, userOptionsToOptions } from './utils';

const logger = debug('playwright-rq:Mocker');

class Mocker {
  private started: boolean;
  private options: Options;
  private page: Page | BrowserContext | undefined;
  private requestHandler: ((route: Route, request: Request) => void) | undefined;

  constructor() {
    logger('create');
    this.started = false;
    this.options = DEFAULT_OPTIONS;
  }

  public async start(userOptions: UserOptions): Promise<void> {
    logger('start(): call');
    if (this.started) {
      logger('Mocker is already started, stop mocker and new start');
      await this.stop();
    }
    this.started = true;
    if (!userOptions.page) {
      throw new Error('Option "page" in not defined');
    }
    this.page = userOptions.page;
    this.options = userOptionsToOptions(userOptions);
    this.requestHandler = createHandler(this.options);

    await this.page.route('**', this.requestHandler);
    logger('start(): finish');
  }

  public update(mockList: MockList): void {
    logger('update(): call');
    if (!this.started) {
      throw new Error('Mocker is not started!');
    }
    this.options.interceptList = {
      ...this.options.interceptList,
      ...userMockListToInterceptList(mockList),
    };
    logger('update(): finish');
  }

  public async stop(): Promise<void> {
    logger('stop(): call');
    if (!this.started) {
      throw new Error('Mocker is not started!');
    }
    await this.page?.unroute('**', this.requestHandler);
    this.started = false;
    logger('stop(): finish');
  }
}

export default Mocker;
