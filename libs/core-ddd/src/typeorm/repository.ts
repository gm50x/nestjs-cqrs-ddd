import { NotFoundException } from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';
import {
  Repository as BaseRepository,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
} from 'typeorm';
import { EntitySchemaFactory } from '../entity-schema.factory';
import { Repository } from '../repository';
import { EntityTypeOrmSchema } from './entity.schema';

export abstract class TypeOrmRepository<
  TSchema extends EntityTypeOrmSchema,
  TEntity extends AggregateRoot,
> implements Repository<TEntity>
{
  constructor(
    protected readonly entityModel: BaseRepository<TSchema>,
    protected readonly entitySchemaFactory: EntitySchemaFactory<
      TSchema,
      TEntity
    >,
  ) {}

  async findOneById(id: string): Promise<TEntity> {
    return this.findOne({
      // TODO: find better types
      where: { _id: parseInt(id) } as any,
    });
  }

  async findOneAndReplaceById(id: string, entity: TEntity): Promise<void> {
    await this.findOneAndReplace(
      {
        // TODO: find better types
        _id: parseInt(id) as any,
      },
      entity,
    );
  }

  async findAll(): Promise<TEntity[]> {
    return this.find({});
  }

  async create(entity: TEntity): Promise<void> {
    const schema = this.entitySchemaFactory.create(entity);
    const result = await this.entityModel.insert([schema as any]);
    const [id] = result.identifiers;
    // TODO: find a better way to do this
    (entity as any).id = id._id;
  }

  async save(entity: TEntity): Promise<void> {
    const schema = this.entitySchemaFactory.create(entity);
    await this.entityModel.update({ _id: schema._id } as any, schema as any);
  }

  protected async find(
    entityFilterQuery?: FindManyOptions<TSchema>,
  ): Promise<TEntity[]> {
    const foundValues = await this.entityModel.find(entityFilterQuery);

    return foundValues.map((entityDocument) =>
      this.entitySchemaFactory.createFromSchema(entityDocument),
    );
  }

  protected async findOne(
    entityFilterQuery?: FindOneOptions<TSchema>,
  ): Promise<TEntity> {
    const entityDocument = await this.entityModel.findOne(entityFilterQuery);

    if (!entityDocument) {
      return;
    }

    return this.entitySchemaFactory.createFromSchema(entityDocument);
  }

  protected async findOneAndReplace(
    entityFilterQuery: FindOptionsWhere<TSchema>,
    entity: TEntity,
  ): Promise<void> {
    const schema = this.entitySchemaFactory.create(entity);
    const queryResult = await this.entityModel.update(
      entityFilterQuery,
      schema as any,
    );
    if (!queryResult.affected) {
      throw new NotFoundException('Unable to find the entity to replace.');
    }
  }
}
