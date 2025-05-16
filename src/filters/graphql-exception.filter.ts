import { ArgumentsHost, Catch } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';

@Catch()
export class GraphQLExceptionFilter implements GqlExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    return {
      message: exception.message,
      code: exception.code || 'UNKNOWN',
      timestamp: new Date().toISOString(),
    };
  }
}
