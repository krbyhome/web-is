import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { parse } from 'pg-connection-string';
import { User } from 'src/user/entities/user.entity';
import { Technology } from 'src/content/entities/technology.entity';
import { Project } from 'src/content/entities/project.entity';
import { Comment } from 'src/interactions/entities/comment.entity';
import { Notification } from 'src/notifications/entities/notification.entity';
import { Stat } from 'src/stats/entities/stat.entity';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) { }

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const connectionString = this.configService.get<string>('DATABASE_CONNECTION_STRING');
    const parsedOptions = parse(connectionString || '');

    return {
      type: 'postgres',
      url: connectionString,
      host: parsedOptions.host || 'localhost',
      port: parseInt(parsedOptions.port || '6432', 10),
      username: parsedOptions.user,
      password: parsedOptions.password,
      database: parsedOptions.database || 'postgres',
      entities: [User, Technology, Project, Comment, Notification, Stat],
      synchronize: true,
      ssl: this.getSslConfig(),
      logging: ['warn', 'error'],
    };
  }

  private getSslConfig() {
    return {
      rejectUnauthorized: false,
      ca: process.env.SERTIFICATE || '',
    };
  }
}