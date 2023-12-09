import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose';
import { AccountModule } from '../../account/account.module';
import { AccountService } from '../application/abstractions/account.service';
import { PositionFactory } from '../application/abstractions/position.factory';
import { PositionRepository } from '../application/abstractions/position.repository';
import { RideFactory } from '../application/abstractions/ride.factory';
import { RideRepository } from '../application/abstractions/ride.repository';
import { PositionMongooseSchemaFactory } from './repositories/mongoose/position-schema.factory';
import { PositionMongooseFactory } from './repositories/mongoose/position.factory';
import { PositionMongooseRepository } from './repositories/mongoose/position.repository';
import { PositionSchema } from './repositories/mongoose/position.schema';
import { RideMongooseSchemaFactory } from './repositories/mongoose/ride-schema.factory';
import { RideMongooseFactory } from './repositories/mongoose/ride.factory';
import { RideMongooseRepository } from './repositories/mongoose/ride.repository';
import { RideSchema } from './repositories/mongoose/ride.schema';
import { AccountClientService } from './services/account-client.service';

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      {
        name: RideSchema.name,
        schema: SchemaFactory.createForClass(RideSchema),
      },
      {
        name: PositionSchema.name,
        schema: SchemaFactory.createForClass(PositionSchema),
      },
    ]),
    AccountModule,
  ],
  providers: [
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
    {
      provide: AccountService,
      useClass: AccountClientService,
    },
  ],
  exports: [
    RideRepository,
    RideFactory,
    PositionRepository,
    PositionFactory,
    AccountService,
  ],
})
export class InfraModule {}
