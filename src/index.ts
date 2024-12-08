import express from 'express';
import { errorHandler } from './middleware/errorHandler';
import userRoutes from './routes/users';
import bookRoutes from './routes/books';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/users', userRoutes);
app.use('/books', bookRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
