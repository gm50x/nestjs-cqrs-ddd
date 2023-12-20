import { AcceptRideInput } from '../models/accept-ride.model';

export class AcceptRideCommand {
  constructor(readonly data: AcceptRideInput) {}
}
