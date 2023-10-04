import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Logger,
  ParseFilePipe,
  Post,
  Put,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  IAuthController,
  LoginResponse,
  ProfileResponse,
  RegisterResponse,
  UploadAvatarResponse,
} from './interface/auth.interface';
import {
  FileUploadDto,
  LoginDto,
  RegisterDto,
  UpdateProfileDto,
} from './dto/auth.dto';
import { AuthGuard } from './auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController implements IAuthController {
  private readonly logger = new Logger();
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({
    status: 201,
    description: 'Created.',
  })
  @ApiResponse({ status: 422, description: 'Unprocessable Entity.' })
  @Post('/register')
  @HttpCode(201)
  @UsePipes(ValidationPipe)
  async register(@Body() req: RegisterDto): Promise<RegisterResponse> {
    try {
      const result = await this.authService.create(req);

      return result;
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(error.message, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  @ApiResponse({
    status: 200,
    description: 'OK.',
  })
  @ApiResponse({ status: 422, description: 'Unprocessable Entity.' })
  @Post('/login')
  @HttpCode(200)
  @UsePipes(ValidationPipe)
  async login(@Body() req: LoginDto): Promise<LoginResponse> {
    try {
      const result = await this.authService.verify(req);

      return result;
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(error.message, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  @ApiResponse({
    status: 200,
    description: 'OK.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 422, description: 'Unprocessable Entity.' })
  @ApiBearerAuth()
  @Get('/profile')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async profile(@Request() req: any): Promise<ProfileResponse> {
    try {
      const result = await this.authService.getById(req.user.userId);

      return result;
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(error.message, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  @ApiResponse({
    status: 204,
    description: 'No Content.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 422, description: 'Unprocessable Entity.' })
  @ApiBearerAuth()
  @Put('/profile')
  @HttpCode(204)
  @UseGuards(AuthGuard)
  async profileUpdate(
    @Request() req: any,
    @Body() updateProfileReq: UpdateProfileDto,
  ): Promise<void> {
    try {
      await this.authService.updateProfileById(
        req.user.userId,
        updateProfileReq,
      );

      return;
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(error.message, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  @ApiResponse({
    status: 200,
    description: 'OK.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 422, description: 'Unprocessable Entity.' })
  @ApiBearerAuth()
  @Post('/profile/avatar')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: FileUploadDto,
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @Request()
    req: any,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image/png' })],
      }),
    )
    file: Express.Multer.File,
  ): Promise<UploadAvatarResponse> {
    try {
      const result = await this.authService.uploadAvatar(req.user.userId, file);

      return result;
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(error.message, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }
}
