import { Router } from 'express';
import { BookController } from '../controllers/bookController';
import {createBookValidator, idValidator, ratingValidator, validateRequest} from '../middleware/validator';

const router = Router();
const bookController = new BookController();

router.get('/', bookController.getAllBooks);
router.get('/:id', idValidator, validateRequest, bookController.getBookById);
router.post('/', createBookValidator, validateRequest, bookController.createBook);

export default router;
