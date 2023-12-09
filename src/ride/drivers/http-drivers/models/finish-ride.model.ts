import { IsString } from 'class-validator';

export class FinishRideRequest {
  @IsString()
  rideId: string;
}
