import { IntegrationEvent } from '@gedai/tactical-design';

export class PositionUpdatedEvent extends IntegrationEvent {
  constructor(
    readonly rideId: string,
    readonly lat: number,
    readonly long: number,
  ) {
    super();
  }
}
