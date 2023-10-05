import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  IAuthService,
  LoginResponse,
  ProfileResponse,
  RegisterResponse,
  UploadAvatarResponse,
} from './interface/auth.interface';
import { LoginDto, RegisterDto, UpdateProfileDto } from './dto/auth.dto';
import { HashPassword, VerifyPassword } from 'src/helper/hash';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { User } from 'src/typeorm';
import { promises as fsPromises } from 'fs';
import { NotFoundError } from 'src/error/notfound.error';
import { ValidationError } from 'src/error/validation.error';

@Injectable()
export class AuthService implements IAuthService {
  private readonly logger = new Logger();

  constructor(
    private userService: UsersService,
    private readonly configService: ConfigService,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(req: RegisterDto): Promise<RegisterResponse> {
    return await this.userService.create(req);
  }

  async verify(req: LoginDto): Promise<LoginResponse> {
    const getUser = await this.userService.findByEmail(req.email);
    if (!getUser) {
      throw new NotFoundError('user not found');
    }

    const isMatch = await VerifyPassword(getUser.password, req.password);

    if (!isMatch) {
      throw new ValidationError('password invalid');
    }

    const payload = {
      sub: getUser.fullName,
      userId: getUser.id,
      email: getUser.email,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      type: 'Bearer',
    };
  }

  async getById(id: number): Promise<ProfileResponse> {
    // check inside cache manager is cached or not
    const value = await this.cacheManager.get<User>(`${id}`);
    if (!value) {
      // if not, retrieve data from db and cache it to cache manager
      this.logger.debug('retrieve data from database...');
      const getUser = await this.userService.findById(id);
      if (!getUser) {
        throw new NotFoundError('user not found');
      }

      await this.cacheManager.set(
        `${id}`,
        getUser,
        this.configService.get('CACHE_TTL'),
      );

      const { password, ...result } = getUser;

      return {
        ...result,
      };
    }

    this.logger.debug('get from cache...');
    return {
      id: value.id,
      fullName: value.fullName,
      email: value.email,
      avatarUrl: value.avatarUrl,
    };
  }

  async updateProfileById(id: number, req: UpdateProfileDto): Promise<void> {
    if (req.password !== undefined) {
      req.password = await HashPassword(req.password);
    }

    await this.userService.updateById(id, req);

    // remove cache if any
    await this.cacheManager.del(`${id}`);

    return;
  }

  async uploadAvatar(
    id: number,
    file: Express.Multer.File,
  ): Promise<UploadAvatarResponse> {
    const saveFilePath = `public/uploads/${file.originalname}`;

    // save file to destinated folders (public/uploads)
    await this.saveFile(saveFilePath, file.buffer);

    // save filepath to users table
    await this.userService.updateById(id, { avatarUrl: saveFilePath });

    // remove cache if any
    await this.cacheManager.del(`${id}`);

    return {
      avatarUrl: saveFilePath,
    };
  }

  private async saveFile(filePath: string, data: Buffer): Promise<void> {
    try {
      await fsPromises.writeFile(filePath, data);
      return;
    } catch (error) {
      this.logger.error(error.message);
      throw new Error(error);
    }
  }
}
