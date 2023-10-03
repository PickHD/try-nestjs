import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  IAuthService,
  LoginResponse,
  RegisterResponse,
} from './interface/auth.interface';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { VerifyPassword } from 'src/helper/hash';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private userService: UsersService,
    private readonly configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async create(req: RegisterDto): Promise<RegisterResponse> {
    return await this.userService.create(req);
  }

  async verify(req: LoginDto): Promise<LoginResponse> {
    const getUser = await this.userService.findByEmail(req.email);
    if (!getUser) {
      throw new Error('user not found');
    }

    const isMatch = await VerifyPassword(getUser.password, req.password);

    if (!isMatch) {
      throw new Error('password invalid');
    }

    const { id, email } = getUser;
    const payload = { sub: id, email: email };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      type: 'Bearer',
    };
  }
}
