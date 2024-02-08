import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class ContextService {
  private readonly context = new AsyncLocalStorage<Map<string, any>>();

  getStore(): Map<string, any> {
    return this.context.getStore() || new Map<string, any>();
  }

  destroy() {
    const store = this.context.getStore();
    store?.clear();
  }

  get<T>(key: string): T {
    const store = this.context.getStore();
    return store?.get(key);
  }

  set<T>(key: string, value: T): void {
    const store = this.context.getStore();
    store.set(key, value);
  }

  run(store: Map<string, any>, callback: () => void) {
    return this.context.run(store, callback);
  }
}
