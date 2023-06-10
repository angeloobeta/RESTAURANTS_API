import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { User } from '../../auth/schemas/user.schema';
import { Category } from '../schema/meal.schema';

export class CreateMenuDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly description: string;

  @IsNotEmpty()
  @IsNumber()
  readonly price: number;

  @IsNotEmpty({ message: 'You cant provider user id' })
  readonly user: User;

  @IsNotEmpty()
  @IsEnum(Category, { message: 'Please select a restaurant' })
  readonly category: Category;

  @IsNotEmpty()
  @IsString()
  readonly restaurant: string;
}
