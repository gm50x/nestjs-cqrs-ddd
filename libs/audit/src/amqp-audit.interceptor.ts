import { AmqpContextType } from '@gedai/amqp';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Message } from 'amqplib';
import { Observable } from 'rxjs';

@Injectable()
export class AmqpAuditInterceptor implements NestInterceptor {
  private logger = new Logger(this.constructor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const contextType = context.getType<AmqpContextType>();
    if (contextType !== AmqpContextType) {
      return next.handle();
    }
    const rpcContext = context.switchToRpc();
    const data = rpcContext.getData();
    const { content, fields, properties } = rpcContext.getContext<Message>();
    this.logger.log({
      message: 'AMQP MESSAGE AUDIT',
      data: {
        fields,
        properties,
        content: data ?? content.toString('utf8'),
      },
    });
    return next.handle();
  }
}
