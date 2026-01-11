import 'reflect-metadata';
import express, { Application } from 'express';
import cors from 'cors';
import { setupSwagger } from './config/swagger';
import userRoutes from './features/user/routes/user.routes';
import productRoutes from './features/product/routes/product.routes';
import { errorHandler, notFound } from './middleware/errorHandler';

export const createApp = (): Application => {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is running' });
  });

  // API Routes
  app.use('/api/users', userRoutes);
  app.use('/api/products', productRoutes);

  // Swagger Documentation
  setupSwagger(app);

  // Error handling
  app.use(notFound);
  app.use(errorHandler);

  return app;
};
