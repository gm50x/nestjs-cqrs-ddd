import {
  ContextifyInterceptor,
  ContextifyModuleOptions,
  ContextifyOptionsFactory,
  ContextifyService,
  MODULE_OPTIONS_TOKEN,
} from '@gedai/contextify';
import { INestApplication, Injectable } from '@nestjs/common';
import { Message } from 'amqplib';
import { randomUUID } from 'crypto';

@Injectable()
export class ContextConfig implements ContextifyOptionsFactory {
  setupWith(): ContextifyModuleOptions | Promise<ContextifyModuleOptions> {
    return {
      interceptorSetup: (store, context) => {
        const rpcContext = context.switchToRpc();
        const { properties } = rpcContext.getContext<Message>();
        const getTraceIdOrCreateNew = () => {
          try {
            return store.get('traceId') || properties?.headers['x-trace-id'];
          } catch {
            return randomUUID();
          }
        };
        const traceId = getTraceIdOrCreateNew();
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
  const context = app.get(ContextifyService);
  const options = app.get(MODULE_OPTIONS_TOKEN);
  app.useGlobalInterceptors(new ContextifyInterceptor(context, options));
  return app;
};
