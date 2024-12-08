export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  available: boolean;
  createdAt: Date;
}

export interface CreateBookDTO {
  title: string;
  author: string;
  isbn: string;
}

export interface BookResponse extends Book {
  averageRating: number | null;
}
