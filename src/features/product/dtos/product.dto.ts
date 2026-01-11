import { IsNotEmpty, IsNumber, IsOptional, IsString, Min, IsObject } from 'class-validator';

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateProductDto:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - unitPrice
 *         - quantity
 *         - measureType
 *         - attributes
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         pictureUrl:
 *           type: string
 *         unitPrice:
 *           type: number
 *           minimum: 0
 *         quantity:
 *           type: number
 *           minimum: 0
 *         measureType:
 *           type: string
 *         attributes:
 *           type: object
 *           additionalProperties: true
 */
export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsOptional()
  pictureUrl?: string;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  unitPrice!: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  quantity!: number;

  @IsString()
  @IsNotEmpty()
  measureType!: string;

  @IsObject()
  @IsNotEmpty()
  attributes!: Record<string, any>;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateProductDto:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         pictureUrl:
 *           type: string
 *         unitPrice:
 *           type: number
 *           minimum: 0
 *         quantity:
 *           type: number
 *           minimum: 0
 *         measureType:
 *           type: string
 *         attributes:
 *           type: object
 *           additionalProperties: true
 */
export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  pictureUrl?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  unitPrice?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  quantity?: number;

  @IsString()
  @IsOptional()
  measureType?: string;

  @IsObject()
  @IsOptional()
  attributes?: Record<string, any>;
}
