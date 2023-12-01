import { IEvent } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';

class EventMetadata {
  readonly id = randomUUID();
  readonly version: string = 'v1';
  readonly timestamp = new Date().toISOString();
  readonly autoPropagated: boolean;

  constructor(autoPropagated: boolean, version: number) {
    this.autoPropagated = autoPropagated;
    this.version = `v${version}`;
  }
}

export class DomainEvent implements IEvent {
  readonly _meta: EventMetadata;

  constructor(autoPropagated = true, version = 1) {
    this._meta = new EventMetadata(autoPropagated, version);
  }
}
