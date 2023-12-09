import { Module } from '@nestjs/common';
import { HttpDriversModule } from './drivers/http-drivers/http-drivers.module';

@Module({
  imports: [HttpDriversModule],
})
export class RideModule {}
