import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { join } from 'path';

import { AppModule } from './app.module';
import configuration from './config/configuration';
import * as session from 'express-session';
import * as methodOverride from 'method-override';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';



async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule
  );
  const hbs = require('hbs');

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  hbs.registerPartials(join(__dirname, '..', 'views/partials'));
  hbs.registerPartials(join(__dirname, '..', 'views/layouts'));

  hbs.registerHelper('formatDate', function (date) {
    return new Date(date).toLocaleDateString('ru-RU');
  });

  hbs.registerHelper('formatDateTime', function (date) {
    return new Date(date).toLocaleString('ru-RU');
  });

  hbs.registerHelper('eq', function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this);
  });

  hbs.registerHelper('neq', function (a, b, options) {
    return a !== b ? options.fn(this) : options.inverse(this);
  });

  hbs.registerHelper('truncate', function (str, len) {
    if (str.length > len) {
      return str.substring(0, len) + '...';
    }
    return str;
  });

  hbs.registerHelper('includes', function (array, value) {
    return array.some(item => item.id === value);
  });

  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'blablabla',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 60 * 60 * 60,
      },
    }),
  );

  app.use(methodOverride('_method'));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  const swaggerconfig = new DocumentBuilder()
    .setTitle('Portfolio with projects forum')
    .setDescription('Portfolio with project forum API description')
    .setVersion('1.0')
    .addTag('projects')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, swaggerconfig);
  SwaggerModule.setup('docs', app, documentFactory);

  const config = configuration();

  await app.listen(config.port);
}
bootstrap();
