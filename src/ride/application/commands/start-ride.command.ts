import { StartRideInput } from '../dtos/start-ride.dto';

export class StartRideCommand {
  constructor(readonly data: StartRideInput) {}
}
