import { DomainEvent } from '@gedai/core-events';
import { TracingService } from '@gedai/tracing';
import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { Subscription } from 'rxjs';
import { AmqpModuleOptions, MODULE_OPTIONS_TOKEN } from './amqp.options';
import { AmqpService } from './amqp.service';

@Injectable()
export class AmqpEventPropagator implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(this.constructor.name);
  private subscription: Subscription;

  constructor(
    private readonly eventBus: EventBus,
    private readonly amqp: AmqpService,
    private readonly tracer: TracingService,
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

  private translateEventNameToRoutingKey(eventName: string): string {
    const baseNameWithoutSuffix = eventName.replace(/Event$/g, '');
    const values = [baseNameWithoutSuffix[0].toLowerCase()];
    for (let i = 1; i < baseNameWithoutSuffix.length; i++) {
      const thisCharacter = baseNameWithoutSuffix[i];
      if (thisCharacter === thisCharacter.toUpperCase()) {
        values.push('.', thisCharacter.toLowerCase());
      } else {
        values.push(thisCharacter);
      }
    }
    return values.join('');
  }

  private async propagate(event: DomainEvent) {
    const { _meta, ...eventData } = event;
    const eventName = event.constructor.name;
    const routingKey = this.translateEventNameToRoutingKey(eventName);
    if (!_meta.autoPropagated) {
      this.logger.debug(
        `Supressing event propagation as ${eventName}.autoPropagated is set to ${_meta.autoPropagated}`,
      );
      return;
    }
    this.logger.debug(
      `Propagating event ${eventName} with routingKey ${routingKey}`,
    );
    const traceId = this.tracer.get('traceId');
    await this.amqp.publish('events', routingKey, eventData, {
      ..._meta,
      'x-trace-id': traceId,
    });
    this.logger.log(
      `Sucessfully propagated ${eventName} with ${routingKey} to the event bus`,
    );
  }
}
