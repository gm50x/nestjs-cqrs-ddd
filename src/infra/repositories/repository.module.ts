import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose';
import { AccountRepository } from '../../application/accounts/abstractions/account.repository';
import { AccountMongoSchemaFactory } from './account/mongodb/account-schema.factory';
import { AccountMongoRepository } from './account/mongodb/account.repository';
import { AccountSchema } from './account/mongodb/account.schema';

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
  ],
  exports: [AccountRepository],
})
export class RepositoryModule {}
