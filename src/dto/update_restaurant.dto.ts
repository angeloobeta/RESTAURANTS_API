import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { Category } from 'src/restaurants/schemas/restaurants.schema';

export class UpdateRestaurantDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;
  @IsNotEmpty()
  @IsString()
  readonly description: string;
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter a valid phone number' })
  readonly email: string;
  @IsNotEmpty()
  @IsPhoneNumber()
  readonly phoneNumber: number;
  @IsNotEmpty()
  @IsString()
  readonly address: string;
  @IsNotEmpty()
  @IsEnum(Category, { message: 'Please select a correct category to update' })
  readonly category: Category;
}
