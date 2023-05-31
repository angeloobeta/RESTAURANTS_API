import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

export enum Category {
  FAST_FOOD = 'Fast food',
  CAFE = 'Cafe',
  FINE_DINNING = 'Fine dinning',
}

@Schema()
export class Restaurant {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  email: string;

  @Prop()
  phoneNumber: number;

  @Prop()
  address: string;

  @Prop()
  category: Category;

  @Prop()
  images?: object[];
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);
