import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  GetRideQuery,
  GetRideResult,
} from '../../../ride/application/queries/get-ride.query';
import {
  RideModel,
  RideService,
} from '../../application/abstractions/ride.service';

@Injectable()
export class InterncalCallRideService implements RideService {
  constructor(private readonly queryBus: QueryBus) {}

  async getById(id: string): Promise<RideModel> {
    const result: GetRideResult = await this.queryBus
      .execute(new GetRideQuery({ rideId: id }))
      .catch(() => null);
    if (!result) {
      return;
    }
    const ride = result.data;
    return {
      id: ride.id,
      date: ride.date,
      status: ride.status,
      from: {
        lat: ride.from.lat,
        long: ride.from.long,
      },
      to: {
        lat: ride.to.lat,
        long: ride.to.long,
      },
      fare: ride.fare,
      distance: ride.distance,
      passenger: {
        id: ride.passenger.id,
        name: ride.passenger.name,
        email: ride.passenger.email,
      },
      driver: {
        id: ride.driver.id,
        name: ride.driver.name,
        email: ride.driver.email,
        carPlate: ride.driver.carPlate,
      },
    };
  }
}
