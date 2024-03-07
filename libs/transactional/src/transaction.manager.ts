import { ContextifyService } from '@gedai/contextify';
import { Injectable } from '@nestjs/common';

export abstract class Transaction<T = any> {
  constructor(protected readonly _hostTransaction: T) {}

  abstract begin(): Promise<void>;
  abstract commit(): Promise<void>;
  abstract rollback(): Promise<void>;
  abstract end(): Promise<void>;

  get hostTransaction(): T {
    return this._hostTransaction;
  }
}

export interface Connection {
  createTransaction(): Transaction;
}

@Injectable()
export abstract class TransactionManager {
  private readonly key = `__${this.constructor.name}.runningTransaction`;

  constructor(protected readonly context: ContextifyService) {}

  abstract createTransaction(): Promise<Transaction>;

  getRunningTransactionOrDefault(): Transaction {
    return this.context.get(this.key);
  }

  async beginTransaction(): Promise<void> {
    const existingTransaction = this.context.get(this.key);
    if (existingTransaction) {
      throw new Error('Transaction is already running for the current context');
    }
    const transaction = await this.createTransaction();
    await transaction.begin();
    this.context.set(this.key, transaction);
  }

  async commitTransaction(): Promise<void> {
    const transaction = this.getRunningTransactionOrFail();
    await transaction.commit();
    await transaction.end();
  }

  async rollbackTransaction(): Promise<void> {
    const transaction = this.getRunningTransactionOrFail();
    await transaction.rollback();
    await transaction.end();
  }

  private getRunningTransactionOrFail() {
    const transaction = this.context.get<Transaction>(this.key);
    if (!transaction) {
      throw new Error('Transaction is not running for the current context');
    }
    return transaction;
  }
}
