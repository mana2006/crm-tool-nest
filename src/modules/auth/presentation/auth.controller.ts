import { Env } from '@/config/envs';
import { ForgotPasswordUseCase } from '@/modules/auth/application/use-cases/forgot-password.use-case';
import { LoginUseCase } from '@/modules/auth/application/use-cases/login.use-case';
import { LogoutUseCase } from '@/modules/auth/application/use-cases/logout.use-case';
import { RefreshTokenUseCase } from '@/modules/auth/application/use-cases/refresh-token.use-case';
import { ResetPasswordUseCase } from '@/modules/auth/application/use-cases/reset-password.use-case';
import { ForgotPasswordDto } from '@/modules/auth/presentation/dto/forgot-password-request.dto';
import { LoginResponseDto } from '@/modules/auth/presentation/dto/login-response.dto';
import { ResetPasswordDto } from '@/modules/auth/presentation/dto/reset-password-request.dto';
import { UserEntity } from '@/modules/users/domain/entities/user.entity';
import { COOKIES } from '@/shared/constants/auth.constants';
import { ClientInfo } from '@/shared/decorators/client-info.decorator';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { JwtAuthGuard } from '@/shared/guards/passport/jwt-auth.guard';
import { LocalAuthGuard } from '@/shared/guards/passport/local-auth.guard';
import { clearAllCookies, setCookie } from '@/shared/utils/cookie.ulti';
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { type Request, type Response } from 'express';
import { LoginRequestDto } from './dto/login-request.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly config: ConfigService<Env, true>,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: Request & { user: { userId: string } }) {
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

    setCookie(
      res,
      COOKIES.ACCESS_TOKEN,
      result.accessToken,
      result.expiredsIn,
      undefined,
      this.config,
    );
    setCookie(
      res,
      COOKIES.REFRESH_TOKEN,
      result.refreshToken,
      result.expiredsIn,
      undefined,
      this.config,
    );

    return {
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

  @Post('logout')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string }> {
    const refreshToken = req.cookies[COOKIES.REFRESH_TOKEN];

    if (refreshToken) {
      await this.logoutUseCase.execute(refreshToken);
    }

    clearAllCookies(res);

    return {
      message: 'Logout successfully.',
    };
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string }> {
    const refreshToken = req.cookies[COOKIES.REFRESH_TOKEN];

    if (!refreshToken) {
      throw new UnauthorizedException('User invalid');
    }

    const result = await this.refreshTokenUseCase.execute(refreshToken);

    setCookie(
      res,
      COOKIES.ACCESS_TOKEN,
      result.accessToken,
      result.expiredAccessToken,
      undefined,
      this.config,
    );
    setCookie(
      res,
      COOKIES.REFRESH_TOKEN,
      result.refreshToken,
      result.expiredRefreshToken,
      undefined,
      this.config,
    );

    return {
      message: 'Get refresh token successful.',
    };
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body() dto: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    await this.forgotPasswordUseCase.execute(dto.email);

    return {
      message: 'Send email forgot password success.',
    };
  }

  @Post('reset-password')
  async resetPassword(
    @Body() dto: ResetPasswordDto,
    @Query('token') token: string,
  ): Promise<{ success: boolean; message: string }> {
    await this.resetPasswordUseCase.execute(dto.password, token);

    return {
      success: true,
      message: 'Update password successfully.',
    };
  }
}
