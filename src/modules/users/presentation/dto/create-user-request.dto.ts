import { Gender, UserStatus } from '@/shared/constants/user.constants';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserRequestDto {
  @IsEmail({}, { message: 'Email invalid' })
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message: 'Password must contain uppercase, lowercase and a number',
  })
  @ApiProperty({
    description:
      'User password (min 8 chars, must contain uppercase, lowercase, and number)',
    example: 'Password@123',
  })
  password: string;

  @IsString()
  @MinLength(8)
  confirmationPassword: string;

  @IsString()
  @MinLength(1, { message: 'First Name is required' })
  @MaxLength(255, { message: 'First Name must be at most 255 characters' })
  @ApiProperty({
    description: 'First Name',
    example: 'Hung',
  })
  firstName: string;

  @IsString()
  @MinLength(1, { message: 'Last Name is required' })
  @MaxLength(255, { message: 'Last Name must be at most 255 characters' })
  @ApiProperty({
    description: 'Nguyen',
    example: 'Nguyen',
  })
  lastName: string;

  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Date of birth must be in yyyy-MM-dd format',
  })
  @ApiProperty({
    description: 'Date of birth (yyyy-MM-dd format)',
    example: '1990-10-01',
  })
  dateOfBirth: string;

  @IsEnum(Gender, { message: 'Gender must be male, female, other' })
  @ApiProperty({
    description: 'Gender',
    example: Gender.MALE,
  })
  gender: Gender;

  @IsString()
  @Matches(/^0[7-9]0[0-9]{8}$/)
  @ApiProperty({
    description: 'Phone',
    example: '0123456789',
  })
  phone: string;

  @MinLength(1, { message: 'Role is required' })
  @ApiProperty({
    description: 'Role',
    example: 'admin',
  })
  roleId: string;

  @IsEnum(UserStatus, { message: 'Status invalid' })
  @ApiProperty({
    description: 'Status',
    example: UserStatus.PENDING,
  })
  status: UserStatus;

  @IsBoolean()
  @ApiProperty({
    description: 'MFA',
  })
  mfaEnabled: boolean;
}
