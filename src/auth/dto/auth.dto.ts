import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @IsNotEmpty()
  @MinLength(4)
  @ApiProperty()
  fullName: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty()
  password: string;
}

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @ApiProperty()
  password: string;
}

export class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}

export class UpdateProfileDto {
  @ApiProperty()
  fullName?: string;

  @ApiProperty()
  email?: string;

  @ApiProperty()
  password?: string;

  avatarUrl?: string;
}
