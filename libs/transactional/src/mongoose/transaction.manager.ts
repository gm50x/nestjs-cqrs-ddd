import { ContextifyService } from '@gedai/contextify';
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ClientSession, Connection } from 'mongoose';

@Injectable()
export class TransactionManager {
  private key = '__mongodbSession';
  constructor(
    @InjectConnection() readonly connection: Connection,
    private readonly context: ContextifyService,
  ) {}

  async beginTransaction() {
    const existingTransaction = this.context.get(this.key);
    if (existingTransaction) {
      throw new Error('Transaction is already running for the current context');
    }
    const transaction = await this.connection.startSession();
    transaction.startTransaction();
    this.context.set(this.key, transaction);
  }

  getRunningTransactionOrDefault(): ClientSession {
    return this.context.get<ClientSession>(this.key);
  }

  private getRunningTransactionOrFail() {
    const transaction = this.context.get<ClientSession>(this.key);
    if (!transaction) {
      throw new Error('Transaction is not running for the current context');
    }
    return transaction;
  }

  async commitTransaction() {
    const transaction = this.getRunningTransactionOrFail();
    await transaction.commitTransaction();
    await transaction.endSession();
  }
  async rollbackTransaction() {
    const transaction = this.getRunningTransactionOrFail();
    await transaction.abortTransaction();
    await transaction.endSession();
  }
}
