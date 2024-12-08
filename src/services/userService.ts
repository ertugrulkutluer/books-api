import { UserRepository } from '../repositories/userRepository';
import { CreateUserDTO, User, UserResponse } from '../types/user.types';
import { AppError } from '../middleware/errorHandler';
import {db} from "../db";

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository(db);
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async getUserById(id: number): Promise<UserResponse> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    const [borrowings, ratings] = await Promise.all([
      this.userRepository.getUserBorrowings(id),
      this.userRepository.getUserRatings(id)
    ]);

    return {
      ...user,
      borrowings,
      ratings
    };
  }

  async createUser(userData: CreateUserDTO): Promise<User> {
    return this.userRepository.create(userData);
  }
}
