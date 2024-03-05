import { IntegrationEvent } from '@gedai/tactical-design';

export class RideFinishedEvent extends IntegrationEvent {
  constructor(readonly rideId: string) {
    super();
  }
}
