import { Injectable } from '@nestjs/common';
import { RideClient } from '../../../ride/drivers/clients/ride.client';
import {
  RideModel,
  RideService,
} from '../../application/abstractions/ride.service';

@Injectable()
export class RideClientService implements RideService {
  constructor(private readonly rideClient: RideClient) {}

  async getById(id: string): Promise<RideModel> {
    const ride = await this.rideClient.getRide(id).catch((err): RideModel => {
      console.log(err);
      return null;
    });
    if (!ride) {
      return;
    }
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
