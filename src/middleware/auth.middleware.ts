import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import session from 'express-session';

export interface CustomSession extends session.Session {
  username?: string;
  userId?: string;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(
    req: Request & { session: CustomSession },
    res: Response,
    next: NextFunction,
  ) {
    res.locals.isAuthenticated = !!req.session?.username;
    res.locals.username = req.session?.username || null;
    res.locals.currentUrl = req.originalUrl;

    next();
  }
}
