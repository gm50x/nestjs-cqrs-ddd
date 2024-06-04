import { IsString } from 'class-validator';
import { Ride } from './ride.dto';

export class GetRideInput {
  @IsString()
  rideId: string;
}

export class GetRideOutput extends Ride {}
