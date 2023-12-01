import { EntityTypeOrmSchema } from '@gedai/core-ddd';
import { Column, Entity } from 'typeorm';
import { PasswordAlgorithm } from '../../../../domain/password.value';
import { TokenAlgorithm } from '../../../../domain/token.value';

@Entity({ name: 'Accounts' })
export class AccountSchema extends EntityTypeOrmSchema {
  @Column()
  readonly name: string;

  @Column()
  readonly email: string;

  @Column({ type: String })
  readonly passwordAlgorithm: PasswordAlgorithm;

  @Column()
  readonly passwordValue: string;

  @Column()
  readonly passwordSalt: string;

  @Column({ nullable: true })
  tokenValue?: string;

  @Column({ nullable: true })
  tokenMeta?: string;

  @Column({ nullable: true, type: String })
  tokenAlgorithm?: TokenAlgorithm;
}
