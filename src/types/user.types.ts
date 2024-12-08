import {BookBorrowing} from "./borrowing.types";

export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

export interface CreateUserDTO {
  name: string;
  email: string;
}

export interface UserResponse extends User {
  borrowings: BookBorrowing[];
  ratings: UserBookRating[];
}

export interface UserBookRating {
  title: string;
  score: number;
}
