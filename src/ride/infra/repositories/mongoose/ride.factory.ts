import { RideRequestedEvent } from '@gedai/core-events/ride/ride-requested.event';
import { Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { Types } from 'mongoose';
import {
  Coord as CoordType,
  RideFactory,
} from '../../../application/abstractions/ride.factory';
import { RideRepository } from '../../../application/abstractions/ride.repository';
import { Coord } from '../../../domain/coord.value';
import { RideStatusFactory } from '../../../domain/ride-status.value';
import { Ride } from '../../../domain/ride.entity';

@Injectable()
export class RideMongooseFactory implements RideFactory {
  constructor(
    private readonly rideRepository: RideRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async create(
    passengerId: string,
    from: CoordType,
    to: CoordType,
  ): Promise<Ride> {
    const ride = new Ride(
      new Types.ObjectId().toHexString(),
      passengerId,
      null,
      new Coord(from.lat, from.long),
      new Coord(to.lat, to.long),
      RideStatusFactory.create('REQUESTED'),
      new Date(),
    );
    await this.rideRepository.create(ride);
    ride.apply(new RideRequestedEvent(ride.id));
    return this.eventPublisher.mergeObjectContext(ride);
  }
}
