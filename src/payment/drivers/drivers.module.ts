import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ApplicationModule } from '../application/application.module';
import { OnRideFinishedController } from './message-drivers/on-ride-finished.controller';

@Module({
  imports: [CqrsModule, ApplicationModule],
  controllers: [OnRideFinishedController],
})
export class DriversModule {}
