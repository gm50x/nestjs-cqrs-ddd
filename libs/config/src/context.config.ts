import {
  ContextInterceptor,
  ContextModuleOptions,
  ContextOptionsFactory,
  ContextService,
  MODULE_OPTIONS_TOKEN,
} from '@gedai/async-context';
import { INestApplication, Injectable } from '@nestjs/common';
import { Message } from 'amqplib';
import { randomUUID } from 'crypto';

@Injectable()
export class ContextConfig implements ContextOptionsFactory {
  setupWith(): ContextModuleOptions | Promise<ContextModuleOptions> {
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
  const context = app.get(ContextService);
  const options = app.get(MODULE_OPTIONS_TOKEN);
  app.useGlobalInterceptors(new ContextInterceptor(context, options));
  return app;
};
