import { ApiProperty } from '@nestjs/swagger';

export class CreateUserResponseDto {
  // @ApiProperty({
  //   description: 'User ID',
  //   example: 1
  // })
  // userId: string

  // @ApiProperty({
  //   description: "User Email",
  //   example: 'admin@example.com'
  // })
  // email: string

  @ApiProperty({
    description: 'Success message',
    example: 'Create user successuful.',
  })
  message: string;
}
