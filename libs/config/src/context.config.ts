import { ContextOptionsFactory } from '@gedai/context';
import { ContextModuleOptions } from '@gedai/context/context.options';
import { Injectable } from '@nestjs/common';
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
