import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { parse } from 'pg-connection-string';
import { readFileSync } from 'fs';
import { join } from 'path';
import { User } from 'src/user/entities/user.entity';
import { UserProfile } from 'src/user/entities/profile.entity';
import { AuthSession } from 'src/user/entities/session.entity';
import { Technology } from 'src/content/entities/technology.entity';
import { Project } from 'src/content/entities/project.entity';
import { Comment } from 'src/interactions/entities/comment.entity';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

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
      entities: [User, UserProfile, AuthSession, Technology, Project, Comment],
      synchronize: false,
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