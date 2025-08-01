import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsUUID,
  IsNumber,
  IsPositive,
  IsEnum,
} from 'class-validator';
import { BidStatus } from '../../models/enums/bidStatus';

export class UpdateBidDto {
  @ApiProperty({
    description: 'ID of the collection this bid is for',
    example: '123e4567-e89b-12d3-a456-426614174001',
    required: false,
  })
  @IsOptional()
  @IsUUID('4', { message: 'Collection ID must be a valid UUID' })
  collectionId?: string;

  @ApiProperty({
    description: 'Bid amount in the smallest currency unit (e.g., cents)',
    example: 5000,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Price must be a number' })
  @IsPositive({ message: 'Price must be positive' })
  price?: number;

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
