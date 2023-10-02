import { Injectable } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { User, IUserService } from './interface/user.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService implements IUserService {
  private users: User[] = [];

  constructor(private readonly configService: ConfigService) {}

  async getAll(): Promise<User[]> {
    try {
      return Promise.resolve(this.users);
    } catch (error) {
      throw new Error(error);
    }
  }

  async create(u: CreateUserDto): Promise<User> {
    try {
      const newUser: User = {
        Id: u.id,
        name: u.name,
      };

      this.users.push(newUser);

      return Promise.resolve(newUser);
    } catch (error) {
      throw new Error(error);
    }
  }

  async getById(id: number): Promise<User> {
    try {
      const getData = this.users.find((v) => v.Id == id);

      if (getData === undefined) {
        return Promise.resolve(null);
      }

      return Promise.resolve(getData);
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateById(id: number, u: Partial<CreateUserDto>): Promise<User> {
    try {
      const getData = this.users.find((v) => v.Id == id);

      if (getData === undefined) {
        return Promise.resolve(null);
      }

      this.users = this.users.filter((u) => u.Id != id);

      const updatedData: User = { Id: getData.Id, name: u.name };

      this.users.push(updatedData);

      return Promise.resolve(updatedData);
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteById(id: number): Promise<number> {
    try {
      const getData = this.users.find((v) => v.Id == id);

      if (getData === undefined) {
        return Promise.resolve(null);
      }

      this.users = this.users.filter((u) => u.Id != id);

      return Promise.resolve(id);
    } catch (error) {
      throw new Error(error);
    }
  }
}
