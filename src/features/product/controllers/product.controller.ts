import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateProductDto, UpdateProductDto } from '../dtos/product.dto';

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  /**
   * @swagger
   * /api/products:
   *   post:
   *     summary: Create a new product
   *     tags: [Products]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateProductDto'
   *     responses:
   *       201:
   *         description: Product created successfully
   *       400:
   *         description: Validation error
   *       500:
   *         description: Server error
   */
  createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const createProductDto = plainToClass(CreateProductDto, req.body);
      const errors = await validate(createProductDto);

      if (errors.length > 0) {
        res.status(400).json({ errors: errors.map((e: any) => Object.values(e.constraints || {})) });
        return;
      }

      const product = await this.productService.createProduct(createProductDto);
      res.status(201).json(product);
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Internal server error' });
    }
  };

  /**
   * @swagger
   * /api/products:
   *   get:
   *     summary: Get all products
   *     tags: [Products]
   *     responses:
   *       200:
   *         description: List of products
   *       500:
   *         description: Server error
   */
  getAllProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      const products = await this.productService.getAllProducts();
      res.status(200).json(products);
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Internal server error' });
    }
  };

  /**
   * @swagger
   * /api/products/{id}:
   *   get:
   *     summary: Get product by ID
   *     tags: [Products]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Product found
   *       404:
   *         description: Product not found
   *       500:
   *         description: Server error
   */
  getProductById = async (req: Request, res: Response): Promise<void> => {
    try {
      const product = await this.productService.getProductById(req.params.id);
      res.status(200).json(product);
    } catch (error: any) {
      res.status(404).json({ message: error.message || 'Product not found' });
    }
  };

  /**
   * @swagger
   * /api/products/{id}:
   *   put:
   *     summary: Update product
   *     tags: [Products]
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
   *             $ref: '#/components/schemas/UpdateProductDto'
   *     responses:
   *       200:
   *         description: Product updated successfully
   *       400:
   *         description: Validation error
   *       404:
   *         description: Product not found
   *       500:
   *         description: Server error
   */
  updateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const updateProductDto = plainToClass(UpdateProductDto, req.body);
      const errors = await validate(updateProductDto);

      if (errors.length > 0) {
        res.status(400).json({ errors: errors.map((e: any) => Object.values(e.constraints || {})) });
        return;
      }

      const product = await this.productService.updateProduct(req.params.id, updateProductDto);
      res.status(200).json(product);
    } catch (error: any) {
      res.status(404).json({ message: error.message || 'Product not found' });
    }
  };

  /**
   * @swagger
   * /api/products/{id}:
   *   delete:
   *     summary: Delete product
   *     tags: [Products]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       204:
   *         description: Product deleted successfully
   *       404:
   *         description: Product not found
   *       500:
   *         description: Server error
   */
  deleteProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.productService.deleteProduct(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(404).json({ message: error.message || 'Product not found' });
    }
  };
}
