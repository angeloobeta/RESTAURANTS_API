import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Restaurant } from '../../restaurants/schemas/restaurants.schema';
import { User } from '../../auth/schemas/user.schema';
export enum Category {
  SOUPS = 'Soup',
  SALADS = 'Salads',
  SANDWICHES = 'Sandwiches',
}
@Schema({ timestamps: true })
export class Meal {
  @Prop()
  name: string;

  @Prop()
  price: number;

  @Prop()
  description: string;

  @Prop({ default: Category.SOUPS })
  category: Category;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' })
  restaurant: Restaurant;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const MealSchema = SchemaFactory.createForClass(Meal);
