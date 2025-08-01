import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BidStatus } from '../../models/enums/bidStatus';

@Entity()
export class Bid {
  @ApiProperty({
    description: 'Unique identifier for the bid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({
    description: 'ID of the collection this bid is for',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @Column({ type: 'uuid' })
  collectionId!: string;

  @ApiProperty({
    description: 'The collection this bid is for',
    type: () => 'Collection',
  })
  @ManyToOne('Collection', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'collectionId' })
  collection!: any;

  @ApiProperty({
    description: 'Bid amount in the smallest currency unit (e.g., cents)',
    example: 5000,
  })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;

  @ApiProperty({
    description: 'ID of the user who placed the bid',
    example: '123e4567-e89b-12d3-a456-426614174002',
  })
  @Column({ type: 'uuid' })
  userId!: string;

  @ApiProperty({
    description: 'The user who placed the bid',
    type: () => 'User',
  })
  @ManyToOne('User', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: any;

  @ApiProperty({
    description: 'Current status of the bid',
    example: 'pending',
    enum: ['pending', 'accepted', 'rejected'],
  })
  @Column({
    type: 'enum',
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  })
  status!: BidStatus;

  @ApiProperty({
    description: 'Timestamp when the bid was created',
    example: '2023-01-01T00:00:00.000Z',
  })
  @CreateDateColumn({ type: 'timestamp', default: () => 'now()' })
  createdAt!: Date;

  @ApiProperty({
    description: 'Timestamp when the bid was last updated',
    example: '2023-01-01T00:00:00.000Z',
  })
  @UpdateDateColumn({ type: 'timestamp', default: () => 'now()' })
  updatedAt!: Date;

  @ApiProperty({
    description:
      'Timestamp when the bid was soft deleted (null if not deleted)',
    example: null,
    required: false,
  })
  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date;

  @ApiProperty({
    description: 'Whether the bid is marked as deleted',
    example: false,
    default: false,
  })
  @Column({ type: 'boolean', default: false })
  isDeleted!: boolean;
}
