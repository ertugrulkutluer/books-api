import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/userService';
import { CreateUserDTO } from '../types/user.types';
import {validationResult} from "express-validator";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.userService.getAllUsers();
      res.json(users);
    } catch (error) {
      next(error);
    }
  };

  getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.getUserById(Number(req.params.id));
      res.json(user);
    } catch (error) {
      next(error);
    }
  };

  createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDTO = {
        name: req.body.name,
        email: req.body.email
      };
      const user = await this.userService.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  };
}
