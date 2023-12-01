import { Module } from '@nestjs/common';
import { MongooseRepositoryModule } from './mongoose/repository.module';
import { TypeOrmRepositoryModule } from './typeorm/repository.module';

@Module({})
export class AccountRepositoryModule {
  static forRoot(dataSource: 'Mongoose' | 'TypeOrm') {
    if (dataSource === 'Mongoose') {
      return MongooseRepositoryModule;
    }
    if (dataSource === 'TypeOrm') {
      return TypeOrmRepositoryModule;
    }
    throw new Error('Fatal');
  }
}
