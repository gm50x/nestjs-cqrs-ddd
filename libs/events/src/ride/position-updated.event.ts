import { DomainEvent } from '@gedai/tactical-domain';

export class PositionUpdatedEvent extends DomainEvent {
  constructor(
    readonly rideId: string,
    readonly lat: number,
    readonly long: number,
  ) {
    super();
  }
}
