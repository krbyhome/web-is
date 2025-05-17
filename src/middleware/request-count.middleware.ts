import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CustomSession } from './auth.middleware';
import { StatService } from 'src/stats/stat.service';

@Injectable()
export class RequestCountMiddleware implements NestMiddleware {
    constructor(private readonly statService: StatService) {}
  use(
    req: Request & { session: CustomSession },
    res: Response,
    next: NextFunction,
  ) {
    const url = req.baseUrl;

    if (!url) {
        return next();
    }

    this.statService.increment(url);

    next();
  }
}
