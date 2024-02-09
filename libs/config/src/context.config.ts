import {
  AsyncContextInterceptor,
  AsyncContextModuleOptions,
  AsyncContextOptionsFactory,
  AsyncContextService,
  MODULE_OPTIONS_TOKEN,
} from '@gedai/async-context';
import { INestApplication, Injectable } from '@nestjs/common';
import { Message } from 'amqplib';
import { randomUUID } from 'crypto';

@Injectable()
export class ContextConfig implements AsyncContextOptionsFactory {
  setupWith(): AsyncContextModuleOptions | Promise<AsyncContextModuleOptions> {
    return {
      interceptorSetup: (store, context) => {
        const rpcContext = context.switchToRpc();
        const { properties } = rpcContext.getContext<Message>();
        const traceId =
          store.get('traceId') ||
          properties.headers['x-trace-id'] ||
          randomUUID();
        store.set('traceId', traceId);
      },
      middlewareSetup: (store, req) => {
        const traceId =
          store.get('traceId') || req.get('x-trace-id') || randomUUID();
        store.set('traceId', traceId);
      },
    };
  }
}

export const configureContextInterceptor = (app: INestApplication) => {
  const context = app.get(AsyncContextService);
  const options = app.get(MODULE_OPTIONS_TOKEN);
  app.useGlobalInterceptors(new AsyncContextInterceptor(context, options));
  return app;
};
