import { PublisherContext } from '@gedai/nestjs-tactical-design';
import { InjectPublisherContext } from '@gedai/nestjs-tactical-design-amqp';
import { RideRequestedEvent } from '@gedai/strategic-design';
import { Injectable } from '@nestjs/common';
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
    @InjectPublisherContext()
    private readonly publisherContext: PublisherContext,
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
    return this.publisherContext.mergeObjectContext(ride);
  }
}
