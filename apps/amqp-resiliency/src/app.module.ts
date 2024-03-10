import { AmqpModule } from '@gedai/amqp';
import { AuditModule } from '@gedai/audit';
import { ContextConfig } from '@gedai/config';
import { ContextifyModule } from '@gedai/contextify';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AmqpConfig } from './config/amqp.config';
import { AmqpResiliencyController } from './drivers/message/amqp-resiliency.controller';
import { DelayMessageRetrialService } from './services/delay-message-retrial.service';

@Module({
  imports: [
    AuditModule,
    AmqpModule.forRootAsync({ useClass: AmqpConfig }),
    ConfigModule.forRoot({ isGlobal: true }),
    ContextifyModule.forRootAsync({ useClass: ContextConfig }),
  ],
  controllers: [AmqpResiliencyController],
  providers: [DelayMessageRetrialService],
})
export class AppModule {}
