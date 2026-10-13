import { LoginUseCase } from '@/modules/auth/application/use-cases/login.use-case';
import { JwtStrategy } from '@/modules/auth/infrastructure/passport/jwt.strategy';
import { LocalAuthGuard } from '@/modules/auth/infrastructure/passport/local-auth.guard';
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { LoginRequestDto } from './dto/login-request.dto';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { UserEntity } from '@/modules/users/domain/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @CurrentUser() user: UserEntity,
    @Body() loginDto: LoginRequestDto,
  ) {
    return this.loginUseCase.execute({
      user: user,
      rememberMe: loginDto.rememberMe,
    });
  }

  @UseGuards(JwtStrategy)
  @Get('me')
  async me(@Req() req: Request & { user: { userId: string } }) {
    return req.user;
  }
}
