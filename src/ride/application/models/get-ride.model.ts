import { IsString } from 'class-validator';
import { Coord } from './request-ride.model';

export class GetRideInput {
  @IsString()
  rideId: string;
}

export class GetRideOutput {
  id: string;
  date: Date;
  status: string;
  from: Coord;
  to: Coord;
  fare?: number;
  distance?: number;
  passenger: {
    id: string;
    name: string;
    email: string;
  };
  driver?: {
    id: string;
    name: string;
    email: string;
    carPlate: string;
  };
}
