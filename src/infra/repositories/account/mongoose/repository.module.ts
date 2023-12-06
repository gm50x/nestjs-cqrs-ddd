import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose';
import { AccountFactory } from '../../../../application/abstractions/account.factory';
import { AccountRepository } from '../../../../application/abstractions/account.repository';
import { PositionFactory } from '../../../../application/abstractions/position.factory';
import { PositionRepository } from '../../../../application/abstractions/position.repository';
import { RideFactory } from '../../../../application/abstractions/ride.factory';
import { RideRepository } from '../../../../application/abstractions/ride.repository';
import { AccountMongooseSchemaFactory } from './account-schema.factory';
import { AccountMongooseFactory } from './account.factory';
import { AccountMongooseRepository } from './account.repository';
import { AccountSchema } from './account.schema';
import { PositionMongooseSchemaFactory } from './position-schema.factory';
import { PositionMongooseFactory } from './position.factory';
import { PositionMongooseRepository } from './position.repository';
import { PositionSchema } from './position.schema';
import { RideMongooseSchemaFactory } from './ride-schema.factory';
import { RideMongooseFactory } from './ride.factory';
import { RideMongooseRepository } from './ride.repository';
import { RideSchema } from './ride.schema';

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      {
        name: AccountSchema.name,
        schema: SchemaFactory.createForClass(AccountSchema),
      },
      {
        name: RideSchema.name,
        schema: SchemaFactory.createForClass(RideSchema),
      },
      {
        name: PositionSchema.name,
        schema: SchemaFactory.createForClass(PositionSchema),
      },
    ]),
  ],
  providers: [
    AccountMongooseSchemaFactory,
    {
      provide: AccountRepository,
      useClass: AccountMongooseRepository,
    },
    {
      provide: AccountFactory,
      useClass: AccountMongooseFactory,
    },
    RideMongooseSchemaFactory,
    {
      provide: RideRepository,
      useClass: RideMongooseRepository,
    },
    {
      provide: RideFactory,
      useClass: RideMongooseFactory,
    },
    PositionMongooseSchemaFactory,
    {
      provide: PositionRepository,
      useClass: PositionMongooseRepository,
    },
    {
      provide: PositionFactory,
      useClass: PositionMongooseFactory,
    },
  ],
  exports: [
    AccountRepository,
    AccountFactory,
    RideRepository,
    RideFactory,
    PositionRepository,
    PositionFactory,
  ],
})
export class MongooseRepositoryModule {}
