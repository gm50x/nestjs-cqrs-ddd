import { PositionUpdatedEvent } from '@gedai/core-events/ride/position-created.event';
import { Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { Types } from 'mongoose';
import { PositionFactory } from '../../../application/abstractions/position.factory';
import { PositionRepository } from '../../../application/abstractions/position.repository';
import { Coord as CoordType } from '../../../application/abstractions/ride.factory';
import { Coord } from '../../../domain/coord.value';
import { Position } from '../../../domain/position.entity';

@Injectable()
export class PositionMongooseFactory implements PositionFactory {
  constructor(
    private readonly positionRepository: PositionRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async create(rideId: string, coord: CoordType): Promise<Position> {
    const position = new Position(
      new Types.ObjectId().toHexString(),
      rideId,
      new Coord(coord.lat, coord.long),
      new Date(),
    );
    await this.positionRepository.create(position);
    position.apply(new PositionUpdatedEvent(position.id));
    return this.eventPublisher.mergeObjectContext(position);
  }
}
