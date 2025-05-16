import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';

@Injectable()
export class S3Service {
  constructor(
    private readonly s3Client: S3Client,
    private readonly config: ConfigService,
    private readonly usersService: UserService,
  ) { }

  private getKey(userId: string): string {
    const suffix = process.env.NODE_ENV ?? 'production';
    return `${userId}-avatar-${suffix}`;
  }

  async uploadFile(userId: string, file: Express.Multer.File) {
    const key = this.getKey(userId);

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.config.get('s3.bucket'),
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
      }),
    );

    const link = `https://${this.config.get('s3.bucket')}.storage.yandexcloud.net/${key}`;

    await this.usersService.updateAvatar(userId, link);
  }
}
