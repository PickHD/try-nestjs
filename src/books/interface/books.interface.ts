import { CreateBookDto, UpdateBookDto } from '../dto/books.dto';

export interface IBooksController {
  create: (req: CreateBookDto) => Promise<BooksResponse>;
  list: () => Promise<BooksResponse[]>;
  detail: (id: number) => Promise<BooksResponse>;
  update: (id: number, req: UpdateBookDto) => Promise<void>;
  delete: (id: number) => Promise<void>;
}

export interface IBooksService {
  create: (req: CreateBookDto) => Promise<BooksResponse>;
  findAll: () => Promise<BooksResponse[]>;
  findById: (id: number) => Promise<BooksResponse>;
  updateById: (id: number, req: UpdateBookDto) => Promise<void>;
  deleteById: (id: number) => Promise<void>;
}

export interface BooksResponse {
  id: number;
  title: string;
  isbn: string;
  publicationYear: number;
  genre: string;
  authorName: string;
  publisherName: string;
}
