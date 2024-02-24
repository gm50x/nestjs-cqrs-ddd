import { AcceptRideInput } from '../dtos/accept-ride.dto';

export class AcceptRideCommand {
  constructor(readonly data: AcceptRideInput) {}
}
