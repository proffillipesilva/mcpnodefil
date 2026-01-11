import { Entity, ObjectIdColumn, ObjectId, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

@Entity('products')
export class Product {
  @ObjectIdColumn()
  id!: ObjectId;

  @Column()
  @IsString()
  @IsNotEmpty()
  name!: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  description!: string;

  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  pictureUrl?: string;

  @Column()
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  unitPrice!: number;

  @Column()
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  quantity!: number;

  @Column()
  @IsString()
  @IsNotEmpty()
  measureType!: string;

  @Column('simple-json')
  attributes!: Record<string, any>;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
