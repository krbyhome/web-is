import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Technology } from './entities/technology.entity';
import { TechnologyService } from './technology.service';
import { Project } from './entities/project.entity';
import { TechnologyController } from './controllers/technology.controller';
import { ProjectModule } from './project.module';
import { TechnologyResolver } from './technology.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([Technology, Project]),
  ],
  controllers: [TechnologyController],
  providers: [TechnologyService, TechnologyResolver],
  exports: [TechnologyService],
})
export class TechnologyModule { }