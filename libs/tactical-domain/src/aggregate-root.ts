import { Constructor } from '@nestjs/cqrs';
import { DomainEvent } from './events';

export abstract class AggregateRoot {
  private readonly events: DomainEvent[] = [];

  private resetEvents() {
    this.events.length = 0;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected async publishAll(events: DomainEvent[]) {
    throw new Error('Publisher Context has not been merged');
  }

  /**
   * Commits (publishes) all uncommitted events.
   * Must have been merged with the publisher context in order to work.
   */
  async commit(): Promise<void> {
    await this.publishAll(this.events);
    this.resetEvents();
  }

  /**
   * Deletes all events from the current state
   */
  async rollback() {
    this.resetEvents();
  }

  /**
   * Applies the event, that is, adds it to the current state
   * @param events the events to apply
   */
  async apply(...events: DomainEvent[]) {
    this.events.push(...events);
  }
}

export abstract class PublisherContext {
  abstract mergeObjectContext<T extends AggregateRoot>(object: T): T;
  abstract mergeClassContext<T extends Constructor<AggregateRoot>>(Class: T): T;
}
