import { MongoRepository } from 'typeorm';
import { AppDataSource } from '../../../config/database';
import { User } from '../entities/user.entity';
import { ObjectId } from 'mongodb';

export class UserRepository {
  private repository: MongoRepository<User>;

  constructor() {
    this.repository = AppDataSource.getMongoRepository(User);
  }

  async create(user: Partial<User>): Promise<User> {
    const newUser = this.repository.create(user);
    return await this.repository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return await this.repository.find();
  }

  async findById(id: string): Promise<User | null> {
    try {
      return await this.repository.findOne({
        where: { _id: new ObjectId(id) } as any,
      });
    } catch (error) {
      return null;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.repository.findOne({
      where: { email } as any,
    });
  }

  async update(id: string, user: Partial<User>): Promise<User | null> {
    try {
      const objectId = new ObjectId(id);
      await this.repository.update(objectId as any, user as any);
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
