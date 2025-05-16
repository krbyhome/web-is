import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Response } from 'express';

@Injectable()
export class ElapsedTimeInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        if (context.getType<'http' | 'graphql'>() === 'graphql') {
            return next.handle();
        }

        const start = Date.now();
        const ctx = context.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest();

        if (response.getHeader('content-type') === 'text/event-stream') {
            return next.handle();
        }

        return next.handle().pipe(
            tap({
                next: (data) => {
                    if (response.headersSent) return;

                    const elapsed = Date.now() - start;
                    response.setHeader('X-Elapsed-Time', `${elapsed}ms`);

                    if (data?.context) {
                        data.context.elapsedTime = elapsed;
                    }

                    console.log(
                        `Request ${request.method} ${request.url} - ${elapsed}ms`,
                    );
                },
                error: (err) => {
                    const elapsed = Date.now() - start;
                    console.error(`Request failed after ${elapsed}ms`, err);
                },
            }),
        );
    }
}  