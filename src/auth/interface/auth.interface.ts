import { LoginDto, RegisterDto, UpdateProfileDto } from '../dto/auth.dto';

export interface IAuthController {
  register: (req: RegisterDto) => Promise<RegisterResponse>;
  login: (req: LoginDto) => Promise<LoginResponse>;
  profile: (req: any) => Promise<ProfileResponse>;
  profileUpdate: (
    req: any,
    updateProfileReq: UpdateProfileDto,
  ) => Promise<void>;
  uploadAvatar: (
    req: any,
    file: Express.Multer.File,
  ) => Promise<UploadAvatarResponse>;
}

export interface IAuthService {
  create: (req: RegisterDto) => Promise<RegisterResponse>;
  verify: (req: LoginDto) => Promise<LoginResponse>;
  getById: (id: number) => Promise<ProfileResponse>;
  updateProfileById: (id: number, req: UpdateProfileDto) => Promise<void>;
  uploadAvatar: (
    id: number,
    file: Express.Multer.File,
  ) => Promise<UploadAvatarResponse>;
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

export interface ProfileResponse {
  id: number;
  fullName: string;
  email: string;
  avatarUrl?: string;
}

export interface UploadAvatarResponse {
  avatarUrl: string;
}
