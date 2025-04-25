import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { join } from 'path';

import { AppModule } from './app.module';
import configuration from './config/configuration';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule
  );
  const hbs = require('hbs');

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  hbs.registerPartials(join(__dirname, '..', 'views/partials'));

  const config = configuration();

  await app.listen(config.port);
}
bootstrap();
