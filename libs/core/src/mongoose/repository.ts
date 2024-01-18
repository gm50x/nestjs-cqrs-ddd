import { TracingService } from '@gedai/tracing';
import { Injectable } from '@nestjs/common';
import { ClientSession, FilterQuery, Model, Types } from 'mongoose';
import { Entity } from '../entity';
import { EntitySchemaFactory } from '../entity-schema.factory';
import { Repository, RepositoryWriteOptions } from '../repository';
import { EntityMongooseSchema } from './entity.schema';

@Injectable()
export abstract class MongooseRepository<
  TSchema extends EntityMongooseSchema,
  TEntity extends Entity,
> implements Repository<TEntity>
{
  constructor(
    protected readonly entityModel: Model<TSchema>,
    protected readonly entitySchemaFactory: EntitySchemaFactory<
      TSchema,
      TEntity
    >,
    protected readonly tracing: TracingService,
  ) {}

  async findById(id: string): Promise<TEntity> {
    return this.findOne({
      _id: new Types.ObjectId(id),
    });
  }

  async findAll(): Promise<TEntity[]> {
    return this.find({});
  }

  protected async find(
    entityFilterQuery?: FilterQuery<TSchema>,
  ): Promise<TEntity[]> {
    const foundValues = await this.entityModel
      .find(entityFilterQuery, {}, { lean: true })
      .exec();
    return foundValues.map((entityDocument) =>
      this.entitySchemaFactory.createFromSchema(entityDocument as TSchema),
    );
  }

  async create(
    entity: TEntity,
    options?: RepositoryWriteOptions,
  ): Promise<void> {
    const { session: rawSession } = options || {};
    const session: ClientSession = this.tracing.get('session');
    const schema = this.entitySchemaFactory.create(entity);
    await new this.entityModel(schema).save({ session });
  }

  async update(
    entity: TEntity,
    options?: RepositoryWriteOptions,
  ): Promise<void> {
    const { session } = options || {};
    const schema = this.entitySchemaFactory.create(entity);
    await this.entityModel.updateOne({ _id: schema._id }, schema, { session });
  }

  protected async findOne(
    entityFilterQuery?: FilterQuery<TSchema>,
  ): Promise<TEntity> {
    const entityDocument = await this.entityModel
      .findOne(entityFilterQuery, {}, { lean: true })
      .exec();

    if (!entityDocument) {
      return;
    }

    return this.entitySchemaFactory.createFromSchema(entityDocument as TSchema);
  }
}
