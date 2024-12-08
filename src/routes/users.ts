import { Router } from 'express';
import { UserController } from '../controllers/userController';
import {createUserValidator, idValidator, ratingValidator, validateRequest} from '../middleware/validator';
import {BookController} from "../controllers/bookController";

const router = Router();
const userController = new UserController();
const bookController = new BookController();

router.get('/', userController.getAllUsers);
router.get('/:id', idValidator, validateRequest, userController.getUserById);
router.post('/', createUserValidator, validateRequest, userController.createUser);
router.post('/:userId/borrow/:id', [...idValidator], validateRequest, bookController.borrowBook);
router.post('/:userId/return/:id', [...idValidator, ...ratingValidator], validateRequest, bookController.returnBook);

export default router;
