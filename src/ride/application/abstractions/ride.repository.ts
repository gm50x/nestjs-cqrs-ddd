import { Repository, RepositoryWriteOptions } from '@gedai/core';

import { Ride } from '../../domain/ride.entity';

export abstract class RideRepository implements Repository<Ride> {
  abstract findById(id: string): Promise<Ride>;
  abstract findAll(): Promise<Ride[]>;
  abstract create(
    entity: Ride,
    options?: RepositoryWriteOptions,
  ): Promise<void>;
  abstract update(
    entity: Ride,
    options?: RepositoryWriteOptions,
  ): Promise<void>;
  abstract getActiveRidesByPassengerId(passengerId: string): Promise<Ride[]>;
  abstract getActiveRidesByDriverId(driverId: string): Promise<Ride[]>;
}
