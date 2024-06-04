import { IsString } from 'class-validator';

export class ProcessPaymentInput {
  @IsString()
  readonly rideId: string;
}
