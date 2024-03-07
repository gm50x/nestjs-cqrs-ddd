import { TransactionalModule } from '@gedai/transactional';
import { MongooseTransactionManager } from '@gedai/transactional-mongoose';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { InfraModule } from '../infra/infra.module';
import { AcceptRideHandler } from './commands/accept-ride.handler';
import { FinishRideHandler } from './commands/finish-ride.handler';
import { RequestRideHandler } from './commands/request-ride.handler';
import { StartRideHandler } from './commands/start-ride.handler';
import { UpdatePositionHandler } from './commands/update-position.handler';
import { GetRideHandler } from './queries/get-ride.handler';

@Module({
  imports: [
    CqrsModule,
    InfraModule,
    TransactionalModule.forRoot({
      TransactionManagerAdapter: MongooseTransactionManager,
    }),
  ],
  providers: [
    AcceptRideHandler,
    FinishRideHandler,
    GetRideHandler,
    RequestRideHandler,
    StartRideHandler,
    UpdatePositionHandler,
  ],
})
export class ApplicationModule {}
