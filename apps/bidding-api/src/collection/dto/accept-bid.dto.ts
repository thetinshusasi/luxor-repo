import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class AcceptBidDto {
  @ApiProperty({
    description: 'The ID of the collection',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  collectionId!: string;

  @ApiProperty({
    description: 'The ID of the bid to accept',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsString()
  @IsNotEmpty()
  bidId!: string;
} 