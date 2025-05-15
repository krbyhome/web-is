import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResponseDto<T> {
  @ApiProperty()
  data: T[];

  @ApiProperty()
  meta: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
  } | null;
}
