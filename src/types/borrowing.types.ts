export interface Borrowing {
  id: number;
  bookId: number;
  userId: number;
  borrowedAt: Date;
  returnedAt: Date | null;
}

export interface BookBorrowing {
  id: number;
  title: string;
  author: string;
  isbn: string;
  available: boolean;
  createdAt: Date;
  borrowedAt: Date;
  returnedAt: Date | null;
}

export interface ReturnBookDTO {
  score: number;
}
