import {
  IsEmail, IsEmpty,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString
} from "class-validator";
import { Category } from '../schemas/restaurants.schema';
import { User } from '../../auth/schemas/user.schema';

export class UpdateRestaurantDto {
  @IsString()
  @IsOptional()
  readonly name: string;
  @IsString()
  @IsOptional()
  readonly description: string;
  @IsOptional()
  @IsEmail({}, { message: 'Please enter a valid phone number' })
  readonly email: string;
  @IsPhoneNumber()
  @IsOptional()
  readonly phoneNumber: number;
  @IsString()
  @IsOptional()
  readonly address: string;
  @IsOptional()
  @IsEnum(Category, { message: 'Please select a correct category to update' })
  readonly category: Category;
  @IsEmpty({ message: 'You can not provide the user id' })
  readonly user: User;
}
