import { IsString } from 'class-validator';

export class StartRideInput {
  @IsString()
  rideId: string;
}
