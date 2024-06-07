import { Max, Min } from 'class-validator';

export class Coord {
  @Min(-90)
  @Max(90)
  lat: number;

  @Min(-180)
  @Max(180)
  long: number;
}

export class Ride {
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
