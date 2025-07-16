import { ApiProperty } from '@nestjs/swagger';
import { CollectionDto } from './collection.dto';
import { IsNumber } from 'class-validator';

export class CollectionListDto {
  @ApiProperty({
    description: 'List of collections',
    type: [CollectionDto],
  })
  data!: CollectionDto[];

  @ApiProperty({
    description: 'Number of items per page',
    example: 100,
  })
  @IsNumber()
  pageSize!: number;

  @ApiProperty({
    description: 'Current page',
    example: 1,
  })
  @IsNumber()
  page!: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 10,
  })
  @IsNumber()
  totalPages!: number;
}
