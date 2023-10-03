import { LoginDto, RegisterDto } from '../dto/auth.dto';

export interface IAuthController {
  register: (req: RegisterDto) => Promise<RegisterResponse>;
  login: (req: LoginDto) => Promise<LoginResponse>;
}

export interface IAuthService {
  create: (req: RegisterDto) => Promise<RegisterResponse>;
  verify: (req: LoginDto) => Promise<LoginResponse>;
}

export interface RegisterResponse {
  id: number;
  fullName: string;
  email: string;
}

export interface LoginResponse {
  accessToken: string;
  type: string;
}
