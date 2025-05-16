import { ObjectType } from '@nestjs/graphql';
import { PaginatedResponse } from 'src/common/utils/pagintated-response.factory';
import { ProjectModel } from '../models/project.model';

@ObjectType()
export class ProjectPaginatedResponse extends PaginatedResponse(
  ProjectModel,
) {}
