import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from 'src/typeorm';
import { Repository } from 'typeorm';
import { BooksResponse, IBooksService } from './interface/books.interface';
import { CreateBookDto, UpdateBookDto } from './dto/books.dto';
import { ValidationError } from 'src/error/validation.error';
import { NotFoundError } from 'src/error/notfound.error';

@Injectable()
export class BooksService implements IBooksService {
  constructor(
    @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
  ) {}

  async create(book: CreateBookDto): Promise<BooksResponse> {
    const check = await this.bookRepository.findOne({
      where: {
        title: book.title,
      },
    });
    if (check) {
      throw new ValidationError('title already exists');
    }

    const newBook = this.bookRepository.create(book);

    const result = await this.bookRepository.save(newBook);

    return {
      id: result.id,
      title: result.title,
      isbn: result.isbn,
      publicationYear: result.publicationYear,
      genre: result.genre,
      authorName: result.authorName,
      publisherName: result.publisherName,
    };
  }

  async findAll(): Promise<BooksResponse[]> {
    const books: BooksResponse[] = [];
    const data = await this.bookRepository.find({ order: { title: 'asc' } });

    if (data.length == 0) {
      return books;
    }

    for (const b of data) {
      const book: BooksResponse = {
        id: b.id,
        title: b.title,
        isbn: b.isbn,
        publicationYear: b.publicationYear,
        genre: b.genre,
        authorName: b.authorName,
        publisherName: b.publisherName,
      };

      books.push(book);
    }

    return books;
  }

  async findById(id: number): Promise<BooksResponse> {
    const book = await this.bookRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!book) {
      throw new NotFoundError('book not found');
    }

    return {
      id: book.id,
      title: book.title,
      isbn: book.isbn,
      publicationYear: book.publicationYear,
      genre: book.genre,
      authorName: book.authorName,
      publisherName: book.publisherName,
    };
  }

  async updateById(id: number, req: UpdateBookDto): Promise<void> {
    const check = await this.bookRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!check) {
      throw new NotFoundError('book not found');
    }

    await this.bookRepository.update({ id: id }, req);

    return;
  }

  async deleteById(id: number): Promise<void> {
    const check = await this.bookRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!check) {
      throw new NotFoundError('book not found');
    }

    await this.bookRepository.delete({ id: id });

    return;
  }
}
