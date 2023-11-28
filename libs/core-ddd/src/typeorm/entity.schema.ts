import { PrimaryGeneratedColumn } from 'typeorm';

export class EntityTypeOrmSchema {
  @PrimaryGeneratedColumn({ name: 'id' })
  readonly _id: number;
}
