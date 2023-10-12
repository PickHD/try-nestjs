import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Book {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
  })
  id: number;

  @Column({
    nullable: false,
  })
  title: string;

  @Column({
    nullable: false,
  })
  isbn: string;

  @Column({
    nullable: false,
    name: 'publication_year',
  })
  publicationYear: number;

  @Column({
    nullable: false,
  })
  genre: string;

  @Column({
    nullable: false,
    name: 'author_name',
  })
  authorName: string;

  @Column({
    nullable: false,
    name: 'publisher_name',
  })
  publisherName: string;
}
