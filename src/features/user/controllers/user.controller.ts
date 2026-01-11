import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * @swagger
   * /api/users:
   *   post:
   *     summary: Create a new user
   *     tags: [Users]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateUserDto'
   *     responses:
   *       201:
   *         description: User created successfully
   *       400:
   *         description: Validation error
   *       500:
   *         description: Server error
   */
  createUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const createUserDto = plainToClass(CreateUserDto, req.body);
      const errors = await validate(createUserDto);

      if (errors.length > 0) {
        res.status(400).json({ errors: errors.map(e => Object.values(e.constraints || {})) });
        return;
      }

      const user = await this.userService.createUser(createUserDto);
      const { password, ...userWithoutPassword } = user as any;
      res.status(201).json(userWithoutPassword);
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Internal server error' });
    }
  };

  /**
   * @swagger
   * /api/users:
   *   get:
   *     summary: Get all users
   *     tags: [Users]
   *     responses:
   *       200:
   *         description: List of users
   *       500:
   *         description: Server error
   */
  getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await this.userService.getAllUsers();
      const usersWithoutPassword = users.map(({ password, ...user }: any) => user);
      res.status(200).json(usersWithoutPassword);
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Internal server error' });
    }
  };

  /**
   * @swagger
   * /api/users/{id}:
   *   get:
   *     summary: Get user by ID
   *     tags: [Users]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: User found
   *       404:
   *         description: User not found
   *       500:
   *         description: Server error
   */
  getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await this.userService.getUserById(req.params.id);
      const { password, ...userWithoutPassword } = user as any;
      res.status(200).json(userWithoutPassword);
    } catch (error: any) {
      res.status(404).json({ message: error.message || 'User not found' });
    }
  };

  /**
   * @swagger
   * /api/users/{id}:
   *   put:
   *     summary: Update user
   *     tags: [Users]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateUserDto'
   *     responses:
   *       200:
   *         description: User updated successfully
   *       400:
   *         description: Validation error
   *       404:
   *         description: User not found
   *       500:
   *         description: Server error
   */
  updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const updateUserDto = plainToClass(UpdateUserDto, req.body);
      const errors = await validate(updateUserDto);

      if (errors.length > 0) {
        res.status(400).json({ errors: errors.map(e => Object.values(e.constraints || {})) });
        return;
      }

      const user = await this.userService.updateUser(req.params.id, updateUserDto);
      const { password, ...userWithoutPassword } = user as any;
      res.status(200).json(userWithoutPassword);
    } catch (error: any) {
      res.status(404).json({ message: error.message || 'User not found' });
    }
  };

  /**
   * @swagger
   * /api/users/{id}:
   *   delete:
   *     summary: Delete user
   *     tags: [Users]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       204:
   *         description: User deleted successfully
   *       404:
   *         description: User not found
   *       500:
   *         description: Server error
   */
  deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.userService.deleteUser(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(404).json({ message: error.message || 'User not found' });
    }
  };
}
