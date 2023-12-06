import { MongooseRepository } from '@gedai/core-ddd';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PositionRepository } from '../../../../application/abstractions/position.repository';
import { Position } from '../../../../domain/position.entity';
import { PositionMongooseSchemaFactory } from './position-schema.factory';
import { PositionSchema } from './position.schema';

@Injectable()
export class PositionMongooseRepository
  extends MongooseRepository<PositionSchema, Position>
  implements PositionRepository
{
  constructor(
    @InjectModel(PositionSchema.name)
    protected readonly userModel: Model<PositionSchema>,
    protected readonly userSchemaFactory: PositionMongooseSchemaFactory,
  ) {
    super(userModel, userSchemaFactory);
  }
}
