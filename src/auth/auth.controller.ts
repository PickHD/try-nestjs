import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  IAuthController,
  LoginResponse,
  RegisterResponse,
} from './interface/auth.interface';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController implements IAuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @HttpCode(201)
  @UsePipes(ValidationPipe)
  async register(@Body() req: RegisterDto): Promise<RegisterResponse> {
    try {
      const result = await this.authService.create(req);

      return result;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('/login')
  @HttpCode(200)
  @UsePipes(ValidationPipe)
  async login(@Body() req: LoginDto): Promise<LoginResponse> {
    try {
      const result = await this.authService.verify(req);

      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/me')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  profile(@Request() req) {
    return req.user;
  }
}
