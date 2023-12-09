import { Repository } from '@gedai/core';

import { Ride } from '../../domain/ride.entity';

export abstract class RideRepository implements Repository<Ride> {
  abstract findOneById(id: string): Promise<Ride>;
  abstract findOneAndReplaceById(id: string, entity: Ride): Promise<void>;
  abstract findAll(): Promise<Ride[]>;
  abstract create(entity: Ride): Promise<void>;
  abstract save(entity: Ride): Promise<void>;
  abstract getActiveRidesByPassengerId(passengerId: string): Promise<Ride[]>;
  abstract getActiveRidesByDriverId(driverId: string): Promise<Ride[]>;
}
