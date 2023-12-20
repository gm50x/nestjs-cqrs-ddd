import { IsString } from 'class-validator';

export class FinishRideInput {
  @IsString()
  rideId: string;
}
