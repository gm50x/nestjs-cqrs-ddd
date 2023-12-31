import { Injectable, NotFoundException } from '@nestjs/common';
import { FilterQuery, Model, Types } from 'mongoose';
import { Entity } from '../entity';
import { EntitySchemaFactory } from '../entity-schema.factory';
import { Repository } from '../repository';
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
  ) {}

  async findOneById(id: string): Promise<TEntity> {
    return this.findOne({
      _id: new Types.ObjectId(id),
    });
  }

  async findOneAndReplaceById(id: string, entity: TEntity): Promise<void> {
    await this.findOneAndReplace(
      { _id: new Types.ObjectId(id) } as FilterQuery<TSchema>,
      entity,
    );
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

  async create(entity: TEntity): Promise<void> {
    const schema = this.entitySchemaFactory.create(entity);
    await new this.entityModel(schema).save();
  }

  async save(entity: TEntity): Promise<void> {
    const schema = this.entitySchemaFactory.create(entity);
    await this.entityModel.updateOne({ _id: schema._id }, schema);
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

  protected async findOneAndReplace(
    entityFilterQuery: FilterQuery<TSchema>,
    entity: TEntity,
  ): Promise<void> {
    const updatedEntityDocument = await this.entityModel
      .findOneAndReplace(
        entityFilterQuery,
        this.entitySchemaFactory.create(entity),
        {
          new: true,
          useFindAndModify: false,
          lean: true,
        },
      )
      .exec();

    if (!updatedEntityDocument) {
      throw new NotFoundException('Unable to find the entity to replace.');
    }
  }
}
