import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from '@nestjs/common';
import { PaginationMetaModel } from '../dto/pagination-meta.dto';

export function PaginatedResponse<T>(ItemType: Type<T>) {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedResponseClass {
    @Field(() => [ItemType])
    data: T[];

    @Field(() => PaginationMetaModel)
    meta: PaginationMetaModel | null;
  }

  return PaginatedResponseClass;
}
