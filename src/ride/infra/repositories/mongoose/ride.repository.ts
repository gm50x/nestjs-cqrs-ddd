import { MongooseRepository } from '@gedai/core';
import { TracingService } from '@gedai/tracing';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RideRepository } from '../../../application/abstractions/ride.repository';
import { Ride } from '../../../domain/ride.entity';
import { RideMongooseSchemaFactory } from './ride-schema.factory';
import { RideSchema } from './ride.schema';

@Injectable()
export class RideMongooseRepository
  extends MongooseRepository<RideSchema, Ride>
  implements RideRepository
{
  constructor(
    @InjectModel(RideSchema.name)
    protected readonly userModel: Model<RideSchema>,
    protected readonly userSchemaFactory: RideMongooseSchemaFactory,
    protected readonly tracing: TracingService,
  ) {
    super(userModel, userSchemaFactory, tracing);
  }

  async getActiveRidesByPassengerId(passengerId: string): Promise<Ride[]> {
    return this.find({
      passengerId: new Types.ObjectId(passengerId),
      status: { $in: ['REQUESTED', 'ACCEPTED', 'IN_PROGRESS'] },
    });
  }

  async getActiveRidesByDriverId(driverId: string): Promise<Ride[]> {
    return this.find({
      driverId: new Types.ObjectId(driverId),
      status: { $in: ['ACCEPTED', 'IN_PROGRESS'] },
    });
  }
}
