import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose';
import { AccountFactory } from '../../../../application/accounts/abstractions/account.factory';
import { AccountRepository } from '../../../../application/accounts/abstractions/account.repository';
import { AccountMongoSchemaFactory } from './account-schema.factory';
import { AccountMongoFactory } from './account.factory';
import { AccountMongoRepository } from './account.repository';
import { AccountSchema } from './account.schema';

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      {
        name: AccountSchema.name,
        schema: SchemaFactory.createForClass(AccountSchema),
      },
    ]),
  ],
  providers: [
    AccountMongoSchemaFactory,
    {
      provide: AccountRepository,
      useClass: AccountMongoRepository,
    },
    {
      provide: AccountFactory,
      useClass: AccountMongoFactory,
    },
    {
      provide: AccountRepository,
      useClass: AccountMongoRepository,
    },
  ],
  exports: [AccountRepository, AccountFactory],
})
export class MongoRepositoryModule {}
