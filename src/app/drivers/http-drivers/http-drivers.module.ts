import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ApplicationModule } from 'src/app/application/application.module';
import { SignUpController } from './controllers/sign-up.controller';

@Module({
  imports: [CqrsModule, ApplicationModule],
  controllers: [SignUpController],
})
export class HttpDriversModule {}
