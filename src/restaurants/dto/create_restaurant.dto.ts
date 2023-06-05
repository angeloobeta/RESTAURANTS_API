import {
  IsEmail,
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { Category } from '../schemas/restaurants.schema';
import { User } from '../../auth/schemas/user.schema';

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
  @IsPhoneNumber('NG', { message: 'Invalid phone number' })
  readonly phoneNumber: number;
  @IsString()
  @IsNotEmpty()
  readonly address: string;
  @IsEnum(Category, { message: 'Please enter a category' })
  @IsNotEmpty()
  readonly category: Category;
  @IsEmpty({ message: 'You can not provide the user id' })
  readonly user: User;
}
