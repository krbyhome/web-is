import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { createHash } from 'crypto';
  import { tap } from 'rxjs/operators';
  import { Response } from 'express';
  
  @Injectable()
  export class EtagInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      if (context.getType<'http' | 'graphql'>() === 'graphql') {
        return next.handle();
      }
  
      const response = context.switchToHttp().getResponse<Response>();
  
      if (response.getHeader('content-type') === 'text/event-stream') {
        return next.handle();
      }
  
      return next.handle().pipe(
        tap((data) => {
          if (response.headersSent) return;
  
          if (data && typeof data === 'object') {
            const json = JSON.stringify(data);
            const etag = createHash('sha256').update(json).digest('hex');
            response.setHeader('ETag', etag);
          }
        }),
      );
    }
  }
  