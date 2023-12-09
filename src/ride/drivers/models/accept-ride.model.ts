import { IsString } from 'class-validator';

export class AcceptRideRequest {
  @IsString()
  driverId: string;

  @IsString()
  rideId: string;
}
