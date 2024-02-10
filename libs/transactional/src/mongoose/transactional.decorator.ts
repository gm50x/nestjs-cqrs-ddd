import { Inject } from '@nestjs/common';
import { TransactionManager } from './transaction.manager';

export function Transactional() {
  const injectTransactionManager = Inject(TransactionManager);
  return (
    target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor,
  ) => {
    injectTransactionManager(target, '__transactionManager');
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const transactionManager: TransactionManager = this.__transactionManager;
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
