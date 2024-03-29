import { isRabbitContext } from '@golevelup/nestjs-rabbitmq';
import {
  CallHandler,
  ExecutionContext,
  INestApplication,
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
    if (!isRabbitContext(context)) {
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

export const configureAmqpAuditInterceptor = (app: INestApplication) => {
  app.useGlobalInterceptors(new AmqpAuditInterceptor());
  Logger.log('AMQP Audit Interceptor initialized', 'Configuration');
  return app;
};
