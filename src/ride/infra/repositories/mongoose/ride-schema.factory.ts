import { EntitySchemaFactory } from '@gedai/core';
import { Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { Types } from 'mongoose';
import { Coord } from '../../../domain/coord.value';
import { RideStatusFactory } from '../../../domain/ride-status.value';
import { Ride } from '../../../domain/ride.entity';
import { RideSchema } from './ride.schema';

@Injectable()
export class RideMongooseSchemaFactory
  implements EntitySchemaFactory<RideSchema, Ride>
{
  constructor(private readonly eventPublisher: EventPublisher) {}
  create(entity: Ride): RideSchema {
    return {
      _id: new Types.ObjectId(entity.id),
      passengerId: new Types.ObjectId(entity.passengerId),
      driverId: entity.driverId ? new Types.ObjectId(entity.driverId) : null,
      status: entity.status.value,
      date: entity.date,
      fare: entity.fare,
      distance: entity.distance,
      from: {
        lat: entity.from.lat,
        long: entity.from.long,
      },
      to: {
        lat: entity.to.lat,
        long: entity.to.long,
      },
    };
  }

  createFromSchema(entitySchema: RideSchema): Ride {
    return this.eventPublisher.mergeObjectContext(
      new Ride(
        entitySchema._id.toHexString(),
        entitySchema.passengerId.toHexString(),
        entitySchema.driverId?.toHexString(),
        new Coord(entitySchema.from.lat, entitySchema.from.long),
        new Coord(entitySchema.to.lat, entitySchema.to.long),
        RideStatusFactory.create(entitySchema.status),
        entitySchema.date,
        entitySchema.fare,
        entitySchema.distance,
      ),
    );
  }
}
