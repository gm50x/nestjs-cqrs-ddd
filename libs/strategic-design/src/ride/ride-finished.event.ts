import { IntegrationEvent } from '@gedai/nestjs-tactical-design';

export class RideFinishedEvent extends IntegrationEvent {
  constructor(readonly rideId: string) {
    super();
  }
}
