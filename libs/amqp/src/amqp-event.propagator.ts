import { DomainEvent } from '@gedai/core';
import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { Subscription } from 'rxjs';
import { AmqpEventNameAdapter } from './amqp-event-name.adapter';
import { AmqpModuleOptions, MODULE_OPTIONS_TOKEN } from './amqp.options';
import { AmqpService } from './amqp.service';

@Injectable()
export class AmqpEventPropagator implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(this.constructor.name);
  private subscription: Subscription;

  constructor(
    private readonly eventBus: EventBus,
    private readonly amqp: AmqpService,
    @Inject(MODULE_OPTIONS_TOKEN)
    private readonly options: AmqpModuleOptions,
  ) {}

  onModuleInit() {
    if (!this.options.enableEventPropagation) {
      this.logger.debug('Event propagation is disabled');
      return;
    }
    this.subscription = this.eventBus.subscribe(this.propagate.bind(this));
  }

  onModuleDestroy() {
    this.subscription?.unsubscribe();
  }

  private async propagate(event: DomainEvent) {
    const { _meta, ...eventData } = event;
    const eventName = event.constructor.name;
    const routingKey = AmqpEventNameAdapter.getRoutingKey(event);
    if (!_meta.autoPropagated) {
      this.logger.debug(
        `Supressing event propagation as ${eventName}.autoPropagated is set to ${_meta.autoPropagated}`,
      );
      return;
    }
    this.logger.debug(
      `Propagating event ${eventName} with routingKey ${routingKey}`,
    );
    await this.amqp.publish('events', routingKey, eventData, { ..._meta });
    this.logger.log(
      `Sucessfully propagated ${eventName} with ${routingKey} to the event bus`,
    );
  }
}
