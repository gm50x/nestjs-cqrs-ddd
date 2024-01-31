import { AggregateRoot, DomainEvent, PublisherContext } from '@gedai/core';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Constructor } from '@nestjs/cqrs';
import { AmqpEventNameAdapterNew } from './amqp-event-name.adapter';
import { AmqpService } from './amqp.service';

@Injectable()
export class AmqpPublisherContext implements PublisherContext {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly amqp: AmqpService,
    private readonly config: ConfigService,
  ) {}

  private async publishAll(events: DomainEvent[]) {
    this.logger.debug(`Publishing ${events.length} to the event bus`);
    const eventBusName = this.config.get('AMQP_EXCHANGE_EVENT_ROOT');
    await Promise.all(
      events.map((x) =>
        this.amqp.publish(
          eventBusName,
          AmqpEventNameAdapterNew.getRoutingKey(x),
          x,
          // TODO: headers for event
        ),
      ),
    );
    this.logger.log(`Published ${events.length} to the event bus`);
  }

  /**
   * Merges the event publisher into the provided object.
   * This is required to make `publishAll` available on `AggregateRoot`.
   * @param object The object to merge into.
   */
  mergeObjectContext<T extends AggregateRoot>(object: T): T {
    object['publishAll'] = this.publishAll.bind(this);
    return object;
  }

  /**
   * Merges the event publisher into the provided class.
   * This is required to make `publishAll` available on `AggregateRoot`.
   * @param Class The class to merge into.
   */
  mergeClassContext<T extends Constructor<AggregateRoot>>(Class: T): T {
    const publishAll = this.publishAll.bind(this);
    return class extends Class {
      protected async publishAll(events) {
        await publishAll(events);
      }
    };
  }
}
