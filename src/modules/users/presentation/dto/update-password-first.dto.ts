import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class UpdatePasswordFirstDto {
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message: 'Password must contain uppercase, lowercase and a number',
  })
  password: string;
}
