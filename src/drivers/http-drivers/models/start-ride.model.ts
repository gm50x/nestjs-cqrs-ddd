import { IsString } from 'class-validator';

export class StartRideRequest {
  @IsString()
  rideId: string;
}
