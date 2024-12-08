import { Book, CreateBookDTO } from '../types/book.types';
import { Knex } from 'knex';
import { TABLES } from '../constants/tableNames';

export class BookRepository {
  constructor(private readonly db: Knex) {}

  async findAll(): Promise<Book[]> {
    return this.db(TABLES.BOOKS).select('*');
  }

  async findById(id: number): Promise<Book | undefined> {
    return this.db(TABLES.BOOKS).where('id', id).first();
  }

  async create(bookData: CreateBookDTO): Promise<Book> {
    const [bookId] = await this.db(TABLES.BOOKS).insert(bookData);

    const book = await this.findById(bookId);
    if (!book) {
      throw new Error('Book creation failed: Unable to find the inserted book.');
    }
    return book;
  }

  async getAverageRating(bookId: number): Promise<number | null> {
    const result = await this.db(TABLES.BOOK_RATINGS)
        .where('book_id', bookId)
        .avg({ average: 'score' })
        .first();
    return result?.average || null;
  }

  async updateAvailability(bookId: number, available: boolean, trx?: Knex.Transaction): Promise<void> {
    const query = this.db(TABLES.BOOKS).where('id', bookId).update({ available });
    if (trx) {
      await query.transacting(trx);
    } else {
      await query;
    }
  }
}
