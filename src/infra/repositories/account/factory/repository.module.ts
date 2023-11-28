import { Module } from '@nestjs/common';
import { MongooseRepositoryModule } from '../mongoose/repository.module';
import { TypeOrmRepositoryModule } from '../typeorm/repository.module';

@Module({})
export class RepositoryModule {
  static forRoot(dataSource: 'Mongo' | 'TypeOrm') {
    if (dataSource === 'Mongo') {
      return MongooseRepositoryModule;
    }
    if (dataSource === 'TypeOrm') {
      return TypeOrmRepositoryModule;
    }
    throw new Error('Fatal');
  }
}
