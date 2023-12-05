import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ApplicationModule } from '../../application/application.module';
import { ChangePasswordController } from './controllers/change-password.controller';
import { RequestRideController } from './controllers/request-ride.controller';
import { SignInController } from './controllers/sign-in.controller';
import { SignUpController } from './controllers/sign-up.controller';

@Module({
  imports: [CqrsModule, ApplicationModule],
  controllers: [
    SignUpController,
    SignInController,
    ChangePasswordController,
    RequestRideController,
  ],
})
export class HttpDriversModule {}
