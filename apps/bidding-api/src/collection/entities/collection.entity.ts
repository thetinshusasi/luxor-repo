import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Bid } from '../../bid/entities/bid.entity';

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
    example: '2023-01-01T00:00:00.000Z',
  })
  @CreateDateColumn({ type: 'timestamp', default: () => 'now()' })
  createdAt!: Date;

  @ApiProperty({
    description: 'Timestamp when the collection was last updated',
    example: '2023-01-01T00:00:00.000Z',
  })
  @UpdateDateColumn({ type: 'timestamp', default: () => 'now()' })
  updatedAt!: Date;

  @ApiProperty({
    description:
      'Timestamp when the collection was soft deleted (null if not deleted)',
    example: null,
    required: false,
  })
  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date;

  @ApiProperty({
    description: 'Whether the collection is marked as deleted',
    example: false,
    default: false,
  })
  @Column({ type: 'boolean', default: false })
  isDeleted!: boolean;

  @ApiProperty({
    description: 'Bids placed on this collection',
    type: () => [Bid],
  })
  @OneToMany(() => Bid, (bid) => bid.collection)
  bids!: Bid[];
}
