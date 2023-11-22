import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { EventBus, IEvent } from '@nestjs/cqrs';
import { Subscription } from 'rxjs';
import { AmqpService } from '../../../sdk/amqp';

@Injectable()
export class AmqpEventPropagator implements OnModuleInit, OnModuleDestroy {
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
    await this.amqp.publish('events', event.constructor.name, event);
  }
}
