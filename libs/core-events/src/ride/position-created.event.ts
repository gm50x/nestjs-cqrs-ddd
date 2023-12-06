import { DomainEvent } from '../domain-event';

export class PositionCreatedEvent extends DomainEvent {
  constructor(readonly rideId: string) {
    super();
  }
}
