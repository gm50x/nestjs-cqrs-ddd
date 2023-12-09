import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ApplicationModule } from '../application/application.module';
import { RideClient } from './clients/ride.client';
import { AcceptRideController } from './http-drivers/controllers/accept-ride.controller';
import { FinishRideController } from './http-drivers/controllers/finish-ride.controller';
import { GetRideController } from './http-drivers/controllers/get-ride.controller';
import { RequestRideController } from './http-drivers/controllers/request-ride.controller';
import { StartRideController } from './http-drivers/controllers/start-ride.controller';
import { UpdatePositionController } from './http-drivers/controllers/update-position.controller';

@Module({
  imports: [CqrsModule, ApplicationModule],
  controllers: [
    RequestRideController,
    AcceptRideController,
    StartRideController,
    UpdatePositionController,
    FinishRideController,
    GetRideController,
  ],
  providers: [RideClient],
  exports: [RideClient],
})
export class DriversModule {}
