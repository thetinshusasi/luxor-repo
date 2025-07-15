import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNumber, IsPositive, IsEnum } from 'class-validator';
import { BidStatus } from '../../models/enums/bidStatus';

export class BidDto {
  @ApiProperty({
    description: 'ID of the bid',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID('4', { message: 'Bid ID must be a valid UUID' })
  id!: string;

  @ApiProperty({
    description: 'ID of the collection this bid is for',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID('4', { message: 'Collection ID must be a valid UUID' })
  collectionId!: string;

  @ApiProperty({
    description: 'Whether the user is the owner of the bid',
    example: true,
  })
  isOwner!: boolean;

  @ApiProperty({
    description: 'Bid amount in the smallest currency unit (e.g., cents)',
    example: 5000,
  })
  @IsNumber({}, { message: 'Price must be a number' })
  @IsPositive({ message: 'Price must be positive' })
  price!: number;

  @ApiProperty({
    description: 'Current status of the bid',
    example: 'pending',
    enum: ['pending', 'accepted', 'rejected'],
  })
  @IsEnum(BidStatus, {
    message: 'Status must be one of: pending, accepted, rejected',
  })
  status!: BidStatus;
}
