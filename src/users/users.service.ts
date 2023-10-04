import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto, UpdateProfileDto } from 'src/auth/dto/auth.dto';
import { HashPassword } from 'src/helper/hash';
import { User } from 'src/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(user: RegisterDto): Promise<User> {
    const check = await this.userRepository.findOne({
      where: {
        email: user.email,
      },
    });
    if (check) {
      throw new Error('email already exists');
    }

    const newUser = this.userRepository.create(user);
    newUser.password = await HashPassword(newUser.password);

    return await this.userRepository.save(newUser);
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({
      where: {
        email: email,
      },
    });
  }

  async findById(id: number): Promise<User> {
    return await this.userRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async updateById(id: number, req: UpdateProfileDto): Promise<void> {
    await this.userRepository.update({ id: id }, req);

    return;
  }
}
