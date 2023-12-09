import { Module } from '@nestjs/common';
import { HttpDriversModule } from './drivers/drivers.module';

@Module({
  imports: [HttpDriversModule],
})
export class RideModule {}
