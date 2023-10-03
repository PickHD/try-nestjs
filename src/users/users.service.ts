import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto } from 'src/auth/dto/auth.dto';
import { HashPassword } from 'src/helper/hash';
import { User } from 'src/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(user: RegisterDto): Promise<User> {
    try {
      const newUser = this.userRepository.create(user);
      newUser.password = await HashPassword(newUser.password);

      return await this.userRepository.save(newUser);
    } catch (error) {
      throw new Error(error);
    }
  }

  async findByEmail(email: string): Promise<User> {
    try {
      return await this.userRepository.findOne({
        where: {
          email: email,
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}
