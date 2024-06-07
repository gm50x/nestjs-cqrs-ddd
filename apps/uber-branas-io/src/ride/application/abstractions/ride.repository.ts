import { Repository } from '@gedai/nestjs-tactical-design';

import { Ride } from '../../domain/ride.entity';

export abstract class RideRepository implements Repository<Ride> {
  abstract findById(id: string): Promise<Ride>;
  abstract findAll(): Promise<Ride[]>;
  abstract create(entity: Ride): Promise<void>;
  abstract update(entity: Ride): Promise<void>;
  abstract getActiveRidesByPassengerId(passengerId: string): Promise<Ride[]>;
  abstract getActiveRidesByDriverId(driverId: string): Promise<Ride[]>;
}
