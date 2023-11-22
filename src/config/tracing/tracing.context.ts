import { AsyncLocalStorage } from 'async_hooks';

export class TracingContext extends AsyncLocalStorage<Map<string, any>> {
  private static instance = new TracingContext();

  static getContext() {
    return TracingContext.instance;
  }
}
