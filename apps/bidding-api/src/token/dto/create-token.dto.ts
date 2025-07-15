import { ApiProperty } from '@nestjs/swagger';

export class CreateTokenDto {
  @ApiProperty({
    description: 'The user ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  userId!: string;

  @ApiProperty({
    description: 'The token',
  })
  token!: string;

  @ApiProperty({
    description: 'The expiration date',
    example: '2023-01-01T00:00:00.000Z',
  })
  expiresAt!: Date;
}
