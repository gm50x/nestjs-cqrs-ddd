import { FinishRideInput } from '../dtos/finish-ride.dto';

export class FinishRideCommand {
  constructor(readonly data: FinishRideInput) {}
}
