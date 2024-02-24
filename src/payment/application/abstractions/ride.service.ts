import { Ride } from '../../../ride/application/dtos/ride.dto';

export abstract class RideService {
  abstract getById(id: string): Promise<Ride>;
}
