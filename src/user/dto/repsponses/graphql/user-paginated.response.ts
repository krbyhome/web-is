import { ObjectType } from '@nestjs/graphql';
import { UserModel } from '../../models/user.model';
import { PaginatedResponse } from 'src/common/utils/pagintated-response.factory';

@ObjectType()
export class UserPaginatedResponse extends PaginatedResponse(UserModel) {}
