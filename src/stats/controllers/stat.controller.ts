import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StatService } from '../stat.service';
import { Stat } from '../entities/stat.entity';

@ApiTags('Stat')
@Controller('api/stat')
export class StatController {
  constructor(
    private readonly statService: StatService,
  ) { }

  @Get()
  @ApiOperation({
    summary: 'Get all stat',
    description: 'Returns stat on all pages',
  })
  @ApiOkResponse({
    description: 'Stat retrieved successfully',
    type: [Stat],
  })
  @ApiNotFoundResponse({
    description: 'No stat found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async findAll() {
    const projects = await this.statService.findAll();

    if (!projects) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    return projects;
  }
}
