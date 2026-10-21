import { LoginUseCase } from '@/modules/auth/application/use-cases/login.use-case';
import { UserEntity } from '@/modules/users/domain/entities/user.entity';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { LocalAuthGuard } from '@/shared/guards/passport/local-auth.guard';
import {
  Body,
  Controller,
  Get,
  Headers,
  Ip,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LoginRequestDto } from './dto/login-request.dto';
import { JwtAuthGuard } from '@/shared/guards/passport/jwt-auth.guard';
import { LoginResponseDto } from '@/modules/auth/presentation/dto/login-response.dto';
import { calculateTimeToLife, setCookie } from '@/shared/utils/cookie.ulti';
import ms, { StringValue } from 'ms';
import { COOKIES } from '@/shared/constants/auth.constants';
import { type Request, type Response } from 'express';
import { ClientInfo } from '@/shared/decorators/client-info.decorator';
import { LogoutUseCase } from '@/modules/auth/application/use-cases/logout.use-case';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly logoutUseCase: LogoutUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: Request & { user: { userId: string } }) {
    console.log('get me: here');

    return req.user;
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @CurrentUser() user: UserEntity,
    @Body() loginDto: LoginRequestDto,
    @ClientInfo() client: { ip: string; userAgent: string },
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponseDto> {
    const result = await this.loginUseCase.execute({
      user: user,
      rememberMe: loginDto.rememberMe,
      ip: client.ip,
      userAgent: client.userAgent,
    });
    const timeToLife = ms(
      calculateTimeToLife(loginDto.rememberMe) as StringValue,
    );

    const cookieExpiry = new Date(Date.now() + timeToLife);

    setCookie(res, COOKIES.REFESH_TOKEN, result.refreshToken, cookieExpiry);

    return {
      accessToken: result.accessToken,
      expiresIn: result.expiredsIn,
      user: {
        id: result.user.id,
        email: result.user.email,
        displayName: result.user.displayName,
        status: result.user.status,
        mfaRequired: result.user.mfaRequired,
        role: result.user.role,
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(
    @CurrentUser() user: UserEntity,
    @Req() req: Request,
  ): Promise<{ message: string }> {
    this.logoutUseCase.execute();

    return {
      message: 'Logout successfully.',
    };
  }
}
