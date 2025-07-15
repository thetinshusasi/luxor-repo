import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsUUID,
  IsNumber,
  IsPositive,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { BidStatus } from '../../models/enums/bidStatus';

export class CreateBidDto {
  @ApiProperty({
    description: 'ID of the collection this bid is for',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsNotEmpty({ message: 'Collection ID is required' })
  @IsUUID('4', { message: 'Collection ID must be a valid UUID' })
  collectionId!: string;

  @ApiProperty({
    description: 'Bid amount in the smallest currency unit (e.g., cents)',
    example: 5000,
  })
  @IsNotEmpty({ message: 'Price is required' })
  @IsNumber({}, { message: 'Price must be a number' })
  @IsPositive({ message: 'Price must be positive' })
  price!: number;

  @ApiProperty({
    description: 'ID of the user who placed the bid',
    example: '123e4567-e89b-12d3-a456-426614174002',
  })
  @ApiProperty({
    description: 'ID of the user who placed the bid',
    example: '123e4567-e89b-12d3-a456-426614174002',
    required: false,
  })
  @IsOptional()
  userId?: string;

  @ApiProperty({
    description: 'Current status of the bid',
    example: 'pending',
    enum: ['pending', 'accepted', 'rejected'],
    required: false,
  })
  @IsOptional()
  @IsEnum(BidStatus, {
    message: 'Status must be one of: pending, accepted, rejected',
  })
  status?: BidStatus;
}
