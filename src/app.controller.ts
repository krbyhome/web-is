import { Body, Controller, Get, Post, Render, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppService } from './app.service';
import { CustomSession } from './middleware/auth.middleware';
import { SubmitNameDto } from './auth/dto/submit-name';
import { UserService } from './user/user.service';
import { CreateUserDto } from './user/dto/create-user.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UserService,
  ) { }


  @Get('/')
  @Render('pages/index')
  getIndexPage() {
    return {
      layout: 'layouts/main',
      title: 'egorsufiyarov | index',
      meta: {
        keywords: 'software,cv,github,index',
        description: 'cv site with my projects'
      },
      styles: ['index.css'],
    };
  }

  @Get('/about')
  @Render('pages/about')
  getAboutPage() {
    return {
      layout: 'layouts/main',
      title: 'egorsufiyarov | about',
      meta: {
        keywords: 'software,cv,github,about',
        description: 'page about me',
      },
      styles: ['about.css'],
      scripts: [
        'https://cdn.knightlab.com/libs/timeline3/latest/js/timeline.js',
        'js/timeline.js',
      ],
      downloadedStyles: [
        'https://cdn.knightlab.com/libs/timeline3/latest/css/timeline.css',
      ],
    };
  }

  @Get('/hobbies')
  @Render('pages/hobbies')
  getHobbiesPage() {
    return {
      layout: 'layouts/main',
      title: 'egorsufiyarov | hobbies',
      meta: {
        keywords: 'github,portfolio,frontend,hobbies',
        description: 'page with my hobbies'
      },
      styles: ['hobbies.css'],
    };
  }

  @Get('/schedule')
  @Render('pages/schedule')
  getSchedulePage() {
    return {
      layout: 'layouts/main',
      title: 'egorsufiyarov | schedule',
      meta: {
        keywords: 'schedule,meetings,calendar',
        description: 'page with my schedule'
      },
      styles: ['schedule.css'],
      scripts: ['js/schedule.js'],
      days: [
        { name: 'Понедельник', events: [] },
        { name: 'Вторник', events: [] },
        { name: 'Среда', events: [] },
        { name: 'Четверг', events: [] },
        { name: 'Пятница', events: [] }
      ]
    };
  }

  @Post('submit-username')
  async submitUsername(
    @Req() req: Request & { session: CustomSession },
    @Res() res: Response,
    @Body() body: SubmitNameDto,
    @Body('returnUrl') returnUrl: string,
  ) {
    req.session.username = body.username;

    let user = await this.userService.findOneByName(body.username);

    if (!user) {
      const dto = new CreateUserDto();

      dto.name = body.username;
      dto.email = `${body.username}@olalala.com`;
      dto.avatar_url = 'https://i.pinimg.com/736x/e0/26/ee/e026eeff9f410567a95fab2360af5338.jpg';

      user = await this.userService.create(dto);
    }

    req.session.userId = user.id;

    res.redirect(returnUrl);
  }

  @Post('logout')
  logout(
    @Req() req: Request,
    @Res() res: Response,
    @Body('returnUrl') returnUrl: string,
  ) {
    req.session.destroy(() => res.redirect(returnUrl));
  }
}
