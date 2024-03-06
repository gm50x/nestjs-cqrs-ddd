import { Test, TestingModule } from '@nestjs/testing';
import { TacticalDesignMongooseService } from './tactical-design-mongoose.service';

describe('TacticalDesignMongooseService', () => {
  let service: TacticalDesignMongooseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TacticalDesignMongooseService],
    }).compile();

    service = module.get<TacticalDesignMongooseService>(TacticalDesignMongooseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
