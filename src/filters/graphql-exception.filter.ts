import { ArgumentsHost, Catch } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';

@Catch(GraphQLError)
export class GraphQLExceptionFilter implements GqlExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const extensions = exception.extensions || {};
    
    return new GraphQLError(exception.message, {
      extensions: {
        code: extensions.code,
        status: extensions.status,
      }
    });
  }
}
