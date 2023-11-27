import { IEvent } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';

class EventMetadata {
  readonly id = randomUUID();
  readonly timestamp = new Date().toISOString();
  readonly autoPropagated: boolean;

  constructor(autoPropagated = true) {
    this.autoPropagated = autoPropagated;
  }
}

export class DomainEvent implements IEvent {
  readonly _meta: EventMetadata;

  constructor(autoPropagated = true) {
    this._meta = new EventMetadata(autoPropagated);
  }
}
