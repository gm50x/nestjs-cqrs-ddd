import { MongooseRepository } from '@gedai/tactical-domain';
import { TransactionManager } from '@gedai/transactional';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PositionRepository } from '../../../application/abstractions/position.repository';
import { Position } from '../../../domain/position.entity';
import { PositionMongooseSchemaFactory } from './position-schema.factory';
import { PositionSchema } from './position.schema';

@Injectable()
export class PositionMongooseRepository
  extends MongooseRepository<PositionSchema, Position>
  implements PositionRepository
{
  constructor(
    protected readonly transactionManager: TransactionManager,
    @InjectModel(PositionSchema.name)
    protected readonly userModel: Model<PositionSchema>,
    protected readonly userSchemaFactory: PositionMongooseSchemaFactory,
  ) {
    super(transactionManager, userModel, userSchemaFactory);
  }
  async findByRideId(rideId: string) {
    return this.find({
      rideId: new Types.ObjectId(rideId),
    });
  }
}
