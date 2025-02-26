import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthEntity } from '@app/shared/entities/auth.entity';
import { LoginDto } from '@app/shared/dto/login.dto';

@Controller('api/auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOkResponse({ type: AuthEntity })
  @HttpCode(HttpStatus.OK)
  async login(@Body() { email, password }: LoginDto) {
    return this.authService.login(email, password);
  }
}
