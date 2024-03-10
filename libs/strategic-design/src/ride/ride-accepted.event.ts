import { IntegrationEvent } from '@gedai/tactical-design';

export class RideAcceptedEvent extends IntegrationEvent {
  constructor(readonly rideId: string) {
    super();
  }
}
