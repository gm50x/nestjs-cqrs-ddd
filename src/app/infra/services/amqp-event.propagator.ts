import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { EventBus, IEvent } from '@nestjs/cqrs';
import { Subscription } from 'rxjs';

@Injectable()
export class AmqpEventPropagator implements OnModuleInit, OnModuleDestroy {
  private subscription: Subscription;
  constructor(private readonly eventBus: EventBus) {}

  onModuleInit() {
    this.subscription = this.eventBus.subscribe(this.propagate.bind(this));
  }

  onModuleDestroy() {
    this.subscription.unsubscribe();
  }

  private propagate(event: IEvent) {
    // TODO: send event to amqp
    console.log('---');
    console.log('got an event');
    console.log(event);
    console.log('shipping to amqp:::got an event');
    console.log('---');
  }
}
