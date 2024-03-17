import { Inject } from '@nestjs/common';
import { getTransactionToken } from './transaction-manager.token';
import { TransactionManager } from './transaction.manager';

export const InjectTransactionManager = (
  connectionName?: string,
  databaseProvider?: string,
) => Inject(getTransactionToken(connectionName, databaseProvider));

export function Transactional(
  connectionName?: string,
  databaseProvider?: string,
) {
  const injectTransactionManager = InjectTransactionManager(
    connectionName,
    databaseProvider,
  );
  return (
    target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor,
  ) => {
    const token = getTransactionToken(connectionName, databaseProvider);
    injectTransactionManager(target, token);
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const transactionManager: TransactionManager = this[token];
      if (!transactionManager) {
        return originalMethod.apply(this, args);
      }
      await transactionManager.beginTransaction();
      try {
        const result = await originalMethod.apply(this, args);
        await transactionManager.commitTransaction();
        return result;
      } catch (error) {
        await transactionManager.rollbackTransaction();
        throw error;
      }
    };
  };
}
