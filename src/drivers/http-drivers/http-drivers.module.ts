import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ApplicationModule } from '../../application/application.module';
import { AcceptRideController } from './controllers/accept-ride.controller';
import { ChangePasswordController } from './controllers/change-password.controller';
import { FinishRideController } from './controllers/finish-ride.controller';
import { GetRideController } from './controllers/get-ride.controller';
import { RequestRideController } from './controllers/request-ride.controller';
import { SignInController } from './controllers/sign-in.controller';
import { SignUpController } from './controllers/sign-up.controller';
import { StartRideController } from './controllers/start-ride.controller';
import { UpdatePositionController } from './controllers/update-position.controller';

@Module({
  imports: [CqrsModule, ApplicationModule],
  controllers: [
    SignUpController,
    SignInController,
    ChangePasswordController,
    RequestRideController,
    AcceptRideController,
    StartRideController,
    UpdatePositionController,
    FinishRideController,
    GetRideController,
  ],
})
export class HttpDriversModule {}
