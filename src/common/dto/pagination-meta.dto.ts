import { Field, Int, ObjectType } from '@nestjs/graphql';

export interface PaginationMeta {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

@ObjectType()
export class PaginationMetaModel {
  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  itemsPerPage: number;

  @Field(() => Int)
  totalItems: number;

  @Field(() => Int)
  totalPages: number;
}
