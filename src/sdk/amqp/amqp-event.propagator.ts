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

  private translateEventNameToRoutingKey(event: IEvent): string {
    const baseName = event.constructor.name;
    const baseNameWithoutSuffix = baseName.replace(/Event$/g, '');
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

  private async propagate(event: IEvent) {
    this.logger.debug('Propagating event');
    const eventName = this.translateEventNameToRoutingKey(event);
    await this.amqp.publish('events', eventName, event);
    this.logger.log('Event Propagated');
  }
}
