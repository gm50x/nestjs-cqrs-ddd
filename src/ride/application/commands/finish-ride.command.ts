import { FinishRideInput } from '../models/finish-ride.model';

export class FinishRideCommand {
  constructor(readonly data: FinishRideInput) {}
}
