import { Request, Response, NextFunction } from 'express';
import { BookService } from '../services/bookService';
import { CreateBookDTO } from '../types/book.types';
import { ReturnBookDTO } from '../types/borrowing.types';

export class BookController {
  private bookService: BookService;

  constructor() {
    this.bookService = new BookService();
  }

  getAllBooks = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const books = await this.bookService.getAllBooks();
      res.json(books);
    } catch (error) {
      next(error);
    }
  };

  getBookById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const book = await this.bookService.getBookById(Number(req.params.id));
      res.json(book);
    } catch (error) {
      next(error);
    }
  };

  createBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bookData: CreateBookDTO = {
        title: req.body.title,
        author: req.body.author,
        isbn: req.body.isbn
      };
      const book = await this.bookService.createBook(bookData);
      res.status(201).json(book);
    } catch (error) {
      next(error);
    }
  };

  borrowBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.bookService.borrowBook(
        Number(req.params.id),
        Number(req.params.userId)
      );
      res.json({ message: 'Book borrowed successfully' });
    } catch (error) {
      next(error);
    }
  };

  returnBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const returnData: ReturnBookDTO = {
        score: req.body.score
      };
      await this.bookService.returnBook(
        Number(req.params.id),
        Number(req.params.userId),
        returnData
      );
      res.json({ message: 'Book returned successfully' });
    } catch (error) {
      next(error);
    }
  };
}
