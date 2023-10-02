import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { IUserController } from './interface/user.interface';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UserController implements IUserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @HttpCode(200)
  async getAll() {
    try {
      const data = await this.userService.getAll();

      return data;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  @HttpCode(201)
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const data = await this.userService.create(createUserDto);

      return data;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  @HttpCode(200)
  async getById(@Param('id') id: number) {
    try {
      const data = await this.userService.getById(id);

      if (data === null) {
        throw new HttpException('user not found', HttpStatus.NOT_FOUND);
      }

      return data;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  @HttpCode(200)
  async updateById(@Param('id') id: number, @Body() u: Partial<CreateUserDto>) {
    try {
      const data = await this.userService.updateById(id, u);
      if (data === null) {
        throw new HttpException('user not found', HttpStatus.NOT_FOUND);
      }

      return data;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  @HttpCode(200)
  async deleteById(@Param('id') id: number) {
    try {
      const data = await this.userService.deleteById(id);
      if (data === null) {
        throw new HttpException('user not found', HttpStatus.NOT_FOUND);
      }

      return data;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
