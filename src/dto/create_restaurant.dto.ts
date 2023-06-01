import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { Category } from '../restaurants/schemas/restaurants.schema';

export class CreateRestaurantDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;
  @IsNotEmpty()
  @IsString()
  readonly description: string;
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter a correct email address' })
  readonly email: string;
  @IsNotEmpty()
  @IsPhoneNumber()
  readonly phoneNumber: number;
  @IsString()
  @IsNotEmpty()
  readonly address: string;
  @IsEnum(Category, { message: 'Please enter a category' })
  @IsNotEmpty()
  readonly category: Category;
}