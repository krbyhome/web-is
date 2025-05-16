import { ObjectType } from '@nestjs/graphql';
import { PaginatedResponse } from 'src/common/utils/pagintated-response.factory';
import { TechnologyModel } from '../models/technology.model';

@ObjectType()
export class TechnologyPaginatedResponse extends PaginatedResponse(
  TechnologyModel,
) {}
