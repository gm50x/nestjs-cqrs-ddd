import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ApplicationModule } from '../../application/application.module';
import { AcceptRideController } from './controllers/accept-ride.controller';
import { FinishRideController } from './controllers/finish-ride.controller';
import { GetRideController } from './controllers/get-ride.controller';
import { RequestRideController } from './controllers/request-ride.controller';
import { StartRideController } from './controllers/start-ride.controller';
import { UpdatePositionController } from './controllers/update-position.controller';

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
})
export class HttpDriversModule {}
