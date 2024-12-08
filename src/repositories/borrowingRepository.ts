import { Borrowing } from '../types/borrowing.types';
import { Knex } from 'knex';
import { TABLES } from '../constants/tableNames';

export class BorrowingRepository {
  constructor(private readonly db: Knex) {}

  async findActiveBorrowing(bookId: number, userId: number): Promise<Borrowing | undefined> {
    return this.db(TABLES.BORROWINGS)
        .where({
          book_id: bookId,
          user_id: userId,
          returned_at: null,
        })
        .first();
  }

  async createBorrowing(
      bookId: number,
      userId: number,
      trx?: Knex.Transaction
  ): Promise<void> {
    const query = this.db(TABLES.BORROWINGS).insert({
      book_id: bookId,
      user_id: userId,
      borrowed_at: new Date(),
    });

    if (trx) {
      await query.transacting(trx);
    } else {
      await query;
    }
  }

  async returnBook(
      borrowingId: number,
      trx?: Knex.Transaction
  ): Promise<void> {
    const query = this.db(TABLES.BORROWINGS)
        .where('id', borrowingId)
        .update({ returned_at: new Date() });

    if (trx) {
      await query.transacting(trx);
    } else {
      await query;
    }
  }

  async addRating(
      bookId: number,
      userId: number,
      score: number,
      trx?: Knex.Transaction
  ): Promise<void> {
    const query = this.db(TABLES.BOOK_RATINGS).insert({
      book_id: bookId,
      user_id: userId,
      score,
    });

    if (trx) {
      await query.transacting(trx);
    } else {
      await query;
    }
  }
}
