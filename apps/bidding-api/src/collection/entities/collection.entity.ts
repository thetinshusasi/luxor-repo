import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Collection {
  @ApiProperty({
    description: 'Unique identifier for the collection',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({
    description: 'Name of the collection',
    example: 'Vintage Art Collection',
  })
  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @ApiProperty({
    description: 'Description of the collection',
    example: 'A curated collection of vintage art pieces from the 20th century',
  })
  @Column({ type: 'text' })
  description!: string;

  @ApiProperty({
    description: 'URL or path to the collection image',
    example: 'https://example.com/images/collection.jpg',
  })
  @Column({ type: 'varchar', length: 500 })
  image!: string;

  @ApiProperty({
    description: 'Number of items in stock for this collection',
    example: 50,
  })
  @Column({ type: 'int' })
  stock!: number;

  @ApiProperty({
    description: 'Price of the collection',
    example: 999.99,
  })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;

  @ApiProperty({
    description: 'Timestamp when the collection was created',
    example: 1640995200000,
  })
  @CreateDateColumn({ type: 'bigint' })
  createdAt!: number;

  @ApiProperty({
    description: 'Timestamp when the collection was last updated',
    example: 1640995200000,
  })
  @UpdateDateColumn({ type: 'bigint' })
  updatedAt!: number;

  @ApiProperty({
    description:
      'Timestamp when the collection was soft deleted (null if not deleted)',
    example: null,
    required: false,
  })
  @DeleteDateColumn({ type: 'bigint' })
  deletedAt?: number;

  @ApiProperty({
    description: 'Whether the collection is marked as deleted',
    example: false,
    default: false,
  })
  @Column({ type: 'boolean', default: false })
  isDeleted!: boolean;

  @ApiProperty({
    description: 'Bids placed on this collection',
    type: () => ['Bid'],
  })
  @OneToMany('Bid', (bid: any) => bid.collection)
  bids!: any[];
}
