import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { EventBus, IEvent } from '@nestjs/cqrs';
import { Subscription } from 'rxjs';
import { AmqpService } from './amqp.service';

@Injectable()
export class AmqpEventPropagator implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(this.constructor.name);
  private subscription: Subscription;

  constructor(
    private readonly eventBus: EventBus,
    private readonly amqp: AmqpService,
  ) {}

  onModuleInit() {
    this.subscription = this.eventBus.subscribe(this.propagate.bind(this));
  }

  onModuleDestroy() {
    this.subscription.unsubscribe();
  }

  private async propagate(event: IEvent) {
    this.logger.debug('Propagating event');
    await this.amqp.publish('events', event.constructor.name, event);
    this.logger.log('Event Propagated');
  }
}
