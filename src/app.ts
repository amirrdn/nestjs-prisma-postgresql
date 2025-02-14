import express, { Application } from 'express';
import userRoutes from './routes/userRoutes';
import marketRoutes from './routes/marketRouter';
import itemRoutes from './routes/itemRouter';
import categoriesRoutes from './routes/categoriesRouter';
import dotenv from 'dotenv';

dotenv.config();

const app: Application = express();

app.use(express.json());

app.use('/api/user', userRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/product', itemRoutes);
app.use('/api/category', categoriesRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
