import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CreateBookDto, UpdateBookDto } from './dto/books.dto';
import { BooksResponse, IBooksController } from './interface/books.interface';
import { BooksService } from './books.service';
import { ValidationError } from 'src/error/validation.error';
import { NotFoundError } from 'src/error/notfound.error';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiTags('books')
@Controller('books')
export class BooksController implements IBooksController {
  private readonly logger: Logger = new Logger();
  constructor(private readonly booksService: BooksService) {}

  @ApiResponse({ status: 201, description: 'Created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 422, description: 'Unprocessable Entity.' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post()
  @HttpCode(201)
  @UsePipes(ValidationPipe)
  async create(@Body() req: CreateBookDto): Promise<BooksResponse> {
    try {
      const result = await this.booksService.create(req);

      return result;
    } catch (error) {
      this.logger.error(error.message);

      if (error instanceof ValidationError) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }

      throw new HttpException(error.message, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  @ApiResponse({ status: 200, description: 'OK.' })
  @ApiResponse({ status: 422, description: 'Unprocessable Entity.' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get()
  @HttpCode(200)
  async list(): Promise<BooksResponse[]> {
    try {
      const result = await this.booksService.findAll();

      return result;
    } catch (error) {
      this.logger.error(error.message);

      throw new HttpException(error.message, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  @ApiResponse({ status: 200, description: 'OK.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Data Not Found.' })
  @ApiResponse({ status: 422, description: 'Unprocessable Entity.' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':id')
  @HttpCode(200)
  async detail(@Param('id') id: number): Promise<BooksResponse> {
    try {
      const result = await this.booksService.findById(id);

      return result;
    } catch (error) {
      this.logger.error(error.message);

      if (error instanceof NotFoundError) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }

      throw new HttpException(error.message, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  @ApiResponse({ status: 204, description: 'No Content.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Data Not Found.' })
  @ApiResponse({ status: 422, description: 'Unprocessable Entity.' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Put(':id')
  @HttpCode(204)
  @UsePipes(ValidationPipe)
  async update(
    @Param('id') id: number,
    @Body() req: UpdateBookDto,
  ): Promise<void> {
    try {
      const result = await this.booksService.updateById(id, req);

      return result;
    } catch (error) {
      this.logger.error(error.message);

      if (error instanceof NotFoundError) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }

      throw new HttpException(error.message, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  @ApiResponse({ status: 204, description: 'No Content.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Data Not Found.' })
  @ApiResponse({ status: 422, description: 'Unprocessable Entity.' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: number): Promise<void> {
    try {
      const result = await this.booksService.deleteById(id);

      return result;
    } catch (error) {
      this.logger.error(error.message);

      if (error instanceof NotFoundError) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }

      throw new HttpException(error.message, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }
}
