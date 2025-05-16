import { Controller, Get, Render, Req } from '@nestjs/common';
import { Request } from 'express';
import { UserService } from '../user.service';
import { CustomSession } from 'src/middleware/auth.middleware';
import { CacheControl } from 'src/common/decorators/cache-controll.decorator';

@Controller('profile')
export class UserMvcController {
  constructor(private readonly userService: UserService) { }

  @Get()
  @Render('pages/users/user-view')
  @CacheControl(5)
  async view(@Req() req: Request & { session: CustomSession }) {
    if (!req.session.username) {
      console.warn('NOT AUTH');
      return null;
    }

    const user = await this.userService.findOneByName(
      req.session.username,
    );

    console.log('Found user:', user);

    return {
      user: user,
      styles: ['user-common.css', 'user-edit.css'],
      layout: 'layouts/main',
    };
  }

  @Get('edit')
  @Render('pages/users/user-edit')
  @CacheControl(5)
  async edit(@Req() req: Request & { session: CustomSession }) {
    if (!req.session.username) {
      console.warn('NOT AUTH');
      return null;
    }

    const user = await this.userService.findOneByName(
      req.session.username,
    );

    console.log('Found user:', user);

    return {
      user: user,
      styles: ['user-edit.css'],
      layout: 'layouts/main',
    };
  }
}
