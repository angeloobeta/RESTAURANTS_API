import { Category } from '../restaurants/schemas/restaurants.schema';

export class RestaurantDto {
  readonly name: string;
  readonly description: string;
  readonly email: string;
  readonly phoneNumber: number;
  readonly address: string;
  readonly category: Category;
}
