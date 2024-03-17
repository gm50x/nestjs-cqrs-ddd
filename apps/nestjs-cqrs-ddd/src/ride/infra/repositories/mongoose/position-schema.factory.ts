import { EntitySchemaFactory, PublisherContext } from '@gedai/tactical-design';
import { InjectPublisherContext } from '@gedai/tactical-design-amqp';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { Coord } from '../../../domain/coord.value';
import { Position } from '../../../domain/position.entity';
import { PositionSchema } from './position.schema';

@Injectable()
export class PositionMongooseSchemaFactory
  implements EntitySchemaFactory<PositionSchema, Position>
{
  constructor(
    @InjectPublisherContext()
    private readonly publisherContext: PublisherContext,
  ) {}
  create(entity: Position): PositionSchema {
    return {
      _id: new Types.ObjectId(entity.id),
      rideId: new Types.ObjectId(entity.rideId),
      timestamp: entity.timestamp,
      coord: {
        lat: entity.coord.lat,
        long: entity.coord.long,
      },
    };
  }

  createFromSchema(entitySchema: PositionSchema): Position {
    return this.publisherContext.mergeObjectContext(
      new Position(
        entitySchema._id.toHexString(),
        entitySchema.rideId.toHexString(),
        new Coord(entitySchema.coord.lat, entitySchema.coord.long),
        entitySchema.timestamp,
      ),
    );
  }
}
