import { body, param } from 'express-validator';
import { db } from "../db";
import { TABLES } from "../constants/tableNames";
import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const createUserValidator = [
  body('email')
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Invalid email format')
      .custom(async (email) => {
        const existingUser = await db(TABLES.USERS).where({ email }).first();
        if (existingUser) {
          throw new Error('Email already exists');
        }
      }),
  body('name')
      .notEmpty().withMessage('Name is required')
      .trim(),
];

export const createBookValidator = [
    body('title')
        .notEmpty()
        .withMessage('Title is required')
        .trim(),
    body('author')
        .notEmpty()
        .withMessage('Author is required')
        .trim(),
    body('isbn')
        .notEmpty()
        .withMessage('ISBN is required')
        .trim()
        .custom(async (isbn) => {
            const existingBook = await db(TABLES.BOOKS).where({ isbn }).first();
            if (existingBook) {
                throw new Error('A book with the same ISBN already exists');
            }
        }),
];

export const ratingValidator = [
  body('score').isInt({ min: 1, max: 10 })
];

export const idValidator = [
  param('id').isInt({ min: 1 })
];

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
