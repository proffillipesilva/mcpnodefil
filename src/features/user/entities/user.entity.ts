import { Entity, ObjectIdColumn, ObjectId, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

@Entity('users')
export class User {
  @ObjectIdColumn()
  id!: ObjectId;

  @Column({ unique: true })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @Column()
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password!: string;

  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  pictureUrl?: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  name!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
