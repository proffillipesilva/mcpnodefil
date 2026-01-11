import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from '../features/user/entities/user.entity';
import { Product } from '../features/product/entities/product.entity';

config();

export const AppDataSource = new DataSource({
  type: 'mongodb',
  url: process.env.MONGODB_URI || 'mongodb://localhost:27017/mcpnodefil',
  synchronize: true,
  logging: process.env.NODE_ENV === 'development',
  entities: [User, Product],
  subscribers: [],
  migrations: [],
});

export const initializeDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connection established successfully');
  } catch (error) {
    console.error('❌ Error during database initialization:', error);
    throw error;
  }
};
