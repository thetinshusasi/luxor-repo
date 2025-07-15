import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsUUID,
  IsOptional,
  Min,
  Max,
  IsBoolean,
} from 'class-validator';

export class CollectionDto {
  @ApiProperty({
    description: 'ID of the collection',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  id!: string;

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
    description: 'Whether the user is the owner of the collection',
    example: true,
  })
  @IsBoolean()
  isOwner!: boolean;

  @ApiProperty({
    description: 'Number of items in stock for this collection',
    example: 50,
    minimum: 1,
    maximum: 1000,
  })
  @IsNumber()
  @Min(1)
  @Max(1000)
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
