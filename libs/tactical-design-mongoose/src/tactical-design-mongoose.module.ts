import { Module } from '@nestjs/common';
import { TacticalDesignMongooseService } from './tactical-design-mongoose.service';

@Module({
  providers: [TacticalDesignMongooseService],
  exports: [TacticalDesignMongooseService],
})
export class TacticalDesignMongooseModule {}
