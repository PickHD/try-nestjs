import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateBookDto {
  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  isbn: string;

  @ApiProperty()
  @IsNotEmpty()
  publicationYear: number;

  @ApiProperty()
  @IsNotEmpty()
  genre: string;

  @ApiProperty()
  @IsNotEmpty()
  authorName: string;

  @ApiProperty()
  @IsNotEmpty()
  publisherName: string;
}

export class UpdateBookDto {
  @ApiProperty()
  title?: string;

  @ApiProperty()
  isbn?: string;

  @ApiProperty()
  publicationYear?: number;

  @ApiProperty()
  genre?: string;

  @ApiProperty()
  authorName?: string;

  @ApiProperty()
  publisherName?: string;
}
