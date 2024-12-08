import { BookRepository } from '../repositories/bookRepository';
import { UserRepository } from '../repositories/userRepository';
import { BorrowingRepository } from '../repositories/borrowingRepository';
import { CreateBookDTO, Book, BookResponse } from '../types/book.types';
import { ReturnBookDTO } from '../types/borrowing.types';
import { AppError } from '../middleware/errorHandler';
import { db } from '../db';

export class BookService {
  private bookRepository: BookRepository;
  private userRepository: UserRepository;
  private borrowingRepository: BorrowingRepository;

  constructor() {
    this.bookRepository = new BookRepository(db);
    this.userRepository = new UserRepository(db);
    this.borrowingRepository = new BorrowingRepository(db);
  }

  async getAllBooks(): Promise<Book[]> {
    return this.bookRepository.findAll();
  }

  async getBookById(id: number): Promise<BookResponse> {
    const book = await this.bookRepository.findById(id);
    if (!book) {
      throw new AppError(404, 'Book not found');
    }

    const averageRating = await this.bookRepository.getAverageRating(id);

    return {
      ...book,
      averageRating
    };
  }

  async createBook(bookData: CreateBookDTO): Promise<Book> {
    return this.bookRepository.create(bookData);
  }

  async borrowBook(bookId: number, userId: number): Promise<void> {
    const book = await this.bookRepository.findById(bookId);
    if (!book) {
      throw new AppError(404, 'Book not found');
    }
    if (!book.available) {
      throw new AppError(400, 'Book is not available');
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    await db.transaction(async (trx) => {
      await this.bookRepository.updateAvailability(bookId, false, trx);
      await this.borrowingRepository.createBorrowing(bookId, userId, trx);
    });
  }

  async returnBook(bookId: number, userId: number, returnData: ReturnBookDTO): Promise<void> {
    const borrowing = await this.borrowingRepository.findActiveBorrowing(bookId, userId);
    if (!borrowing) {
      throw new AppError(404, 'No active borrowing found');
    }

    await db.transaction(async (trx: any) => {
      await this.bookRepository.updateAvailability(bookId, true, trx);
      await this.borrowingRepository.returnBook(borrowing.id, trx);
      await this.borrowingRepository.addRating(bookId, userId, returnData.score, trx);
    });
  }
}
