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
import { UserRole } from '../../models/enums/userRole';

// Temporary enum for migration generation

@Entity()
export class User {
  @ApiProperty({
    description: 'Unique identifier for the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
  })
  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @ApiProperty({
    description: 'Email address of the user (must be unique)',
    example: 'john.doe@example.com',
  })
  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @ApiProperty({
    description: 'Role of the user in the system',
    example: UserRole.CUSTOMER,
    enum: UserRole,
  })
  @Column({ type: 'enum', enum: UserRole, default: UserRole.CUSTOMER })
  role!: UserRole;

  @ApiProperty({
    description: 'Hashed password for user authentication',
    example: '$2b$10$hashedpasswordstring',
  })
  @Column({ type: 'varchar', length: 255 })
  hashedPassword!: string;

  @ApiProperty({
    description: 'Timestamp when the user was created',
    example: '2023-01-01T00:00:00.000Z',
  })
  @CreateDateColumn({ type: 'timestamp', default: () => 'now()' })
  createdAt!: Date;

  @ApiProperty({
    description: 'Timestamp when the user was last updated',
    example: '2023-01-01T00:00:00.000Z',
  })
  @UpdateDateColumn({ type: 'timestamp', default: () => 'now()' })
  updatedAt!: Date;

  @ApiProperty({
    description:
      'Timestamp when the user was soft deleted (null if not deleted)',
    example: null,
    required: false,
  })
  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date;

  @ApiProperty({
    description: 'Whether the user account is active',
    example: true,
    default: true,
  })
  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @ApiProperty({
    description: 'Whether the user account is marked as deleted',
    example: false,
    default: false,
  })
  @Column({ type: 'boolean', default: false })
  isDeleted!: boolean;

  @ApiProperty({
    description: 'Whether the user email has been verified',
    example: false,
    default: false,
  })
  @Column({ type: 'boolean', default: false })
  isVerified!: boolean;

  @ApiProperty({
    description: 'Whether the user has admin privileges',
    example: false,
    default: false,
  })
  @Column({ type: 'boolean', default: false })
  isAdmin!: boolean;

  @ApiProperty({
    description: 'Bids placed by this user',
    type: () => ['Bid'],
  })
  @OneToMany('Bid', 'user')
  bids!: any[];

  @ApiProperty({
    description: 'Collections created by this user',
    type: () => ['Collection'],
  })
  @OneToMany('Collection', 'user')
  collections!: any[];

  @ApiProperty({
    description: 'Tokens associated with the user',
    type: () => ['Token'],
  })
  @OneToMany('Token', 'user')
  tokens!: any[];
}
