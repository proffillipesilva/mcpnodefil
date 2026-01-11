import { MongoRepository } from 'typeorm';
import { AppDataSource } from '../../../config/database';
import { Product } from '../entities/product.entity';
import { ObjectId } from 'mongodb';

export class ProductRepository {
  private repository: MongoRepository<Product>;

  constructor() {
    this.repository = AppDataSource.getMongoRepository(Product);
  }

  async create(product: Partial<Product>): Promise<Product> {
    const newProduct = this.repository.create(product);
    return await this.repository.save(newProduct);
  }

  async findAll(): Promise<Product[]> {
    return await this.repository.find();
  }

  async findById(id: string): Promise<Product | null> {
    try {
      return await this.repository.findOne({
        where: { _id: new ObjectId(id) } as any,
      });
    } catch (error) {
      return null;
    }
  }

  async update(id: string, product: Partial<Product>): Promise<Product | null> {
    try {
      const objectId = new ObjectId(id);
      await this.repository.update(objectId as any, product as any);
      return await this.findById(id);
    } catch (error) {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.repository.delete(new ObjectId(id) as any);
      return result.affected !== null && result.affected !== undefined && result.affected > 0;
    } catch (error) {
      return false;
    }
  }
}
