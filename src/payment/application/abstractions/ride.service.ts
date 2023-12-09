export class RideModel {
  id: string;
  date: Date;
  status: string;
  from: {
    lat: number;
    long: number;
  };
  to: {
    lat: number;
    long: number;
  };
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

export abstract class RideService {
  abstract getById(id: string): Promise<RideModel>;
}
