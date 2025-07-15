import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
@Entity()
export class Token {
  @ApiProperty({
    description: 'Unique identifier for the token',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne('User', 'tokens', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: any;

  @Column()
  token!: string;

  @CreateDateColumn({ type: 'timestamp' })
  expiresAt!: Date;
}
