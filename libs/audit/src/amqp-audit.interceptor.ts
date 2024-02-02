import { AmqpContextType } from '@gedai/amqp';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Message } from 'amqplib';
import { Observable, catchError, tap, throwError } from 'rxjs';

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
    const rpcData = rpcContext.getData();
    const { content, fields, properties } = rpcContext.getContext<Message>();
    const message = 'AMQP MESSAGE AUDIT';
    const logData = {
      fields,
      properties,
      content: rpcData ?? content.toString('utf8'),
    };
    return next.handle().pipe(
      tap((result) =>
        this.logger.log({
          message,
          data: logData,
          result,
        }),
      ),
      catchError((error) => {
        this.logger.error({ message, data: logData, error });
        return throwError(() => error);
      }),
    );
  }
}
