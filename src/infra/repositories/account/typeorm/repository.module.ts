import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountFactory } from '../../../../application/accounts/abstractions/account.factory';
import { AccountRepository } from '../../../../application/accounts/abstractions/account.repository';
import { AccountTypeOrmSchemaFactory } from './account-schema.factory';
import { AccountTypeOrmFactory } from './account.factory';
import { AccountTypeOrmRepository } from './account.repository';
import { AccountSchema } from './account.schema';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([AccountSchema])],
  providers: [
    AccountTypeOrmSchemaFactory,
    {
      provide: AccountFactory,
      useClass: AccountTypeOrmFactory,
    },
    {
      provide: AccountRepository,
      useClass: AccountTypeOrmRepository,
    },
  ],
  exports: [AccountRepository, AccountFactory],
})
export class TypeOrmRepositoryModule {}
