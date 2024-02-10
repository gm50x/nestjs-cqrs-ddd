import { IntegrationEvent } from '@gedai/tactical-domain';

export class RideAcceptedEvent extends IntegrationEvent {
  constructor(readonly rideId: string) {
    super();
  }
}
