import { Module } from '@nestjs/common';
import { MongoRepositoryModule } from '../mongodb/repository.module';
import { TypeOrmRepositoryModule } from '../typeorm/repository.module';

@Module({})
export class RepositoryModule {
  static forRoot(dataSource: 'Mongo' | 'TypeOrm') {
    if (dataSource === 'Mongo') {
      return MongoRepositoryModule;
    }
    if (dataSource === 'TypeOrm') {
      return TypeOrmRepositoryModule;
    }
    throw new Error('Fatal');
  }
}
