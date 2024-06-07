import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Ride } from '../../../ride/application/dtos/ride.dto';
import {
  GetRideQuery,
  GetRideResult,
} from '../../../ride/application/queries/get-ride.query';
import { RideService } from '../../application/abstractions/ride.service';

@Injectable()
export class InterncalCallRideService implements RideService {
  constructor(private readonly queryBus: QueryBus) {}

  async getById(id: string): Promise<Ride> {
    const result: GetRideResult = await this.queryBus
      .execute(new GetRideQuery({ rideId: id }))
      .catch(() => null);
    if (!result) {
      return;
    }
    const { data: ride } = result;
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
