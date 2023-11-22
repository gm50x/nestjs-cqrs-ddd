import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AmqpConnection } from './amqp.connection';
import { AmqpService } from './amqp.service';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [AmqpConnection, AmqpService],
  exports: [AmqpService],
})
export class AmqpModule {}
