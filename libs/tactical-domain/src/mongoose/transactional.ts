import { ContextService } from '@gedai/async-context';
import { Inject } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

export function MongooseTransactional() {
  const injectContext = Inject(ContextService);
  const injectConnection = Inject(getConnectionToken());
  return (
    target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor,
  ) => {
    // TODO: abstract this away with the use of a TransactionManager.
    injectContext(target, '__context');
    injectConnection(target, '__connection');
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const context: ContextService = this.__context;
      const connection: Connection = this.__connection;
      const session = await connection.startSession();
      session.startTransaction();
      context.set('mongodbSession', session);
      try {
        const result = await originalMethod.apply(this, args);
        await session.commitTransaction();
        return result;
      } catch (error) {
        await session.abortTransaction();
        throw error;
      } finally {
        await session.endSession();
      }
    };
  };
}
