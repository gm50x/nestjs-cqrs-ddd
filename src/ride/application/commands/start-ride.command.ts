import { StartRideInput } from '../models/start-ride.model';

export class StartRideCommand {
  constructor(readonly data: StartRideInput) {}
}
