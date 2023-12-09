import { Coord } from '../abstractions/ride.factory';

export class GetRideQuery {
  constructor(readonly rideId: string) {}
}

export class GetRideResult {
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
