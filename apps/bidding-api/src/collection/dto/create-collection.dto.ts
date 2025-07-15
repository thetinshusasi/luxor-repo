import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsUUID,
  Min,
  Max,
  IsOptional,
} from 'class-validator';

export class CreateCollectionDto {
  @ApiProperty({
    description: 'Name of the collection',
    example: 'Vintage Art Collection',
  })
  @IsString()
  name!: string;

  @ApiProperty({
    description: 'Description of the collection',
    example: 'A curated collection of vintage art pieces from the 20th century',
  })
  @IsString()
  description!: string;

  @ApiProperty({
    description: 'ID of the user who owns the collection',
    example: '123e4567-e89b-12d3-a456-426614174002',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  userId?: string;

  @ApiProperty({
    description: 'Number of items in stock for this collection',
    example: 50,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  stock!: number;

  @ApiProperty({
    description: 'Price of the collection',
    example: 999.99,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  price!: number;
}
