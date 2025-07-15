import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Current password for verification',
    example: 'currentPassword123',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  currentPassword!: string;

  @ApiProperty({
    description: 'New password for the user',
    example: 'newSecurePassword123',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  newPassword!: string;

  @ApiProperty({
    description: 'Confirmation of the new password',
    example: 'newSecurePassword123',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  confirmPassword!: string;
}
