import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatService } from './stat.service';
import { Stat } from './entities/stat.entity';
import { StatController } from './controllers/stat.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Stat]),
  ],
  controllers: [StatController],
  providers: [StatService],
  exports: [StatService],
})
export class StatModule { }