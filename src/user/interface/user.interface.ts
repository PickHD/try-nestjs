import { CreateUserDto } from '../dto/create-user.dto';

export interface User {
  Id: number;
  name: string;
}

export interface IUserController {
  getAll: () => Promise<User[]>;
  create: (u: CreateUserDto) => Promise<User>;
  getById: (id: number) => Promise<User>;
  updateById: (id: number, u: Partial<CreateUserDto>) => Promise<User>;
  deleteById: (id: number) => Promise<number>;
}

export interface IUserService {
  getAll: () => Promise<User[]>;
  create: (u: CreateUserDto) => Promise<User>;
  getById: (id: number) => Promise<User>;
  updateById: (id: number, u: Partial<CreateUserDto>) => Promise<User>;
  deleteById: (id: number) => Promise<number>;
}
