import { User, CreateUserDTO, UserBookRating } from '../types/user.types';
import { BookBorrowing } from '../types/borrowing.types';
import { Knex } from 'knex';
import { TABLES } from '../constants/tableNames';

export class UserRepository {
  constructor(private readonly db: Knex) {}

  async findAll(): Promise<User[]> {
    return this.db(TABLES.USERS).select('*');
  }

  async findById(id: number): Promise<User | undefined> {
    return this.db(TABLES.USERS).where('id', id).first();
  }

  async create(userData: CreateUserDTO): Promise<User> {
    const [userId] = await this.db(TABLES.USERS).insert(userData);

    const user = await this.findById(userId);
    if (!user) {
      throw new Error('User creation failed: Unable to find the inserted user.');
    }
    return user;
  }

  async getUserBorrowings(userId: number): Promise<BookBorrowing[]> {
    return this.db(TABLES.BORROWINGS)
        .where('user_id', userId)
        .leftJoin(TABLES.BOOKS, `${TABLES.BORROWINGS}.book_id`, `${TABLES.BOOKS}.id`)
        .select(`${TABLES.BOOKS}.*`, `${TABLES.BORROWINGS}.borrowed_at`, `${TABLES.BORROWINGS}.returned_at`);
  }

  async getUserRatings(userId: number): Promise<UserBookRating[]> {
    return this.db(TABLES.BOOK_RATINGS)
        .where('user_id', userId)
        .leftJoin(TABLES.BOOKS, `${TABLES.BOOK_RATINGS}.book_id`, `${TABLES.BOOKS}.id`)
        .select(`${TABLES.BOOKS}.title`, `${TABLES.BOOK_RATINGS}.rating`);
  }
}
