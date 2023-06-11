import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { User } from '../../auth/schemas/user.schema';
import { Category } from '../schema/menu.schema';

export class UpdateMenuDto {
  @IsString()
  @IsOptional()
  readonly name: string;

  @IsOptional()
  readonly description: string;

  @IsOptional()
  @IsNumber()
  readonly price: number;

  @IsOptional()
  readonly user: User;

  @IsOptional()
  @IsEnum(Category, { message: 'Please select a restaurant' })
  readonly category: Category;

  @IsOptional()
  @IsString()
  readonly restaurant: string;
}
