import { IsString } from 'class-validator';

export class AcceptRideInput {
  @IsString()
  driverId: string;

  @IsString()
  rideId: string;
}
