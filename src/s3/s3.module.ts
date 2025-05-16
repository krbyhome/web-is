import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { S3Service } from './s3.service';
import { S3Client } from '@aws-sdk/client-s3';
import { S3Controller } from './s3.controller';
import { UserModule } from 'src/user/user.module';
import s3Config from 'src/config/s3.config';

@Module({
  imports: [ConfigModule.forFeature(s3Config), forwardRef(() => UserModule)],
  providers: [
    {
      provide: S3Client,
      useFactory: (config: ConfigService) => {
        return new S3Client({
          region: config.get('s3.region'),
          endpoint: `http://${config.get('s3.endpoint')}`,
          credentials: {
            accessKeyId: config.get('s3.accessKey'),
            secretAccessKey: config.get('s3.secretKey'),
          } as any,
        });
      },
      inject: [ConfigService],
    },
    S3Service,
  ],
  controllers: [S3Controller],
  exports: [S3Service],
})
export class S3Module {}
