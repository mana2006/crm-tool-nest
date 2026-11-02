import { CreateUseCase } from '@/modules/users/application/use-cases/create.use-case';
import { UpdatePasswordFirstUseCase } from '@/modules/users/application/use-cases/update-password-first.use-case';
import { UserEntity } from '@/modules/users/domain/entities/user.entity';
import { CreateUserRequestDto } from '@/modules/users/presentation/dto/create-user-request.dto';
import { CreateUserResponseDto } from '@/modules/users/presentation/dto/create-user-response.dto';
import { UpdatePasswordFirstDto } from '@/modules/users/presentation/dto/update-password-first.dto';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { JwtAuthGuard } from '@/shared/guards/passport/jwt-auth.guard';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Authentication')
@ApiBearerAuth()
@ApiSecurity('bearer')
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(
    private readonly createUser: CreateUseCase,
    private readonly updatePasswordFirstUseCase: UpdatePasswordFirstUseCase,
  ) {}

  @Post('create')
  @ApiOperation({
    summary:
      'Complete registeration with full profile data. User must login manually after registration.',
  })
  @ApiHeader({
    name: 'X-Verification-Token',
    description: 'Registration token from verify-email',
    required: true,
  })
  @ApiResponse({ status: 201, type: CreateUserResponseDto })
  @ApiResponse({
    status: 401,
    description: 'Invalid or expired registration token',
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async create(
    @Body() dto: CreateUserRequestDto,
  ): Promise<CreateUserResponseDto> {
    await this.createUser.execute(dto);

    return {
      message: 'Create user succesfully',
    };
  }

  @Post('update-password-first')
  async updatePasswordFirst(
    @Body() dto: UpdatePasswordFirstDto,
    @CurrentUser() user: UserEntity,
  ): Promise<{ success: boolean; message: string }> {
    const result = await this.updatePasswordFirstUseCase.execute(
      user.email,
      dto.password,
    );

    return {
      success: result.success,
      message: result.message,
    };
  }
}
