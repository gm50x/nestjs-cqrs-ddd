import { IntegrationEvent } from '@gedai/tactical-domain';

export class RideFinishedEvent extends IntegrationEvent {
  constructor(readonly rideId: string) {
    super();
  }
}
