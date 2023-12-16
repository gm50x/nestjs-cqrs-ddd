import { AmqpContextType } from '@gedai/amqp';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Message } from 'amqplib';
import { randomUUID } from 'crypto';
import { Observable } from 'rxjs';
import { TracingContext } from './tracing.context';

@Injectable()
export class AmqpTracingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const contextType = context.getType<AmqpContextType>();
    if (contextType !== AmqpContextType) {
      return next.handle();
    }
    const runningContext = TracingContext.getContext();
    const rpcContext = context.switchToRpc();
    const { properties } = rpcContext.getContext<Message>();
    const traceId = properties.headers['x-trace-id'] ?? randomUUID();
    const contextStore = new Map();
    contextStore.set('traceId', traceId);
    return new Observable((subscriber) => {
      runningContext.run(contextStore, async () =>
        next
          .handle()
          .pipe()
          .subscribe({
            next: (d) => subscriber.next(d),
            complete: () => subscriber.complete(),
            error: (e) => {
              e.context = contextStore;
              return subscriber.error(e);
            },
          }),
      );
    });
  }
}
