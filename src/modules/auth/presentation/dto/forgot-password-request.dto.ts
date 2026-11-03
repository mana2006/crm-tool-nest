import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({ description: 'Email address', example: 'test@example.com' })
  @IsEmail()
  @IsString()
  email: string;
}
