import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Email of the user',
    example: 'john_doe@gmail.com',
  })
  @IsNotEmpty()
  @IsString()
  email!: string;

  @ApiProperty({
    description: 'Password of the user',
    example: 'strongPassword123',
  })
  @IsNotEmpty()
  @IsString()
  password!: string;
}
