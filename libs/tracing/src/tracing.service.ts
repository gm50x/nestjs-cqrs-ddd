import { Injectable } from '@nestjs/common';
import { TracingContext } from './tracing.context';

@Injectable()
export class TracingService {
  constructor(private readonly context: TracingContext) {}

  getContext() {
    return this.context.getStore();
  }

  get(key: string) {
    const store = this.context.getStore();
    return store?.get(key);
  }
}
