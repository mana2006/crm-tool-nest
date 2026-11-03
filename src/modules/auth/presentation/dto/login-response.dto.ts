import { type AuthResponseUser } from '@/shared/types';
import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({
    description: 'User Information',
    example: {
      id: '1',
      email: 'test@test.com',
      displayName: 'Jackson Micheal',
      status: 'PENDING',
      role: {
        id: '1',
        name: 'Admin',
      },
    },
  })
  user: AuthResponseUser;
}
