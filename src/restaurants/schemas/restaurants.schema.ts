import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../../auth/schemas/user.schema';
import * as mongoose from 'mongoose';
import { Menu } from '../../menu/schema/menu.schema';

@Schema({ timestamps: true })
export class Location {
  @Prop({ type: String, enum: ['Point'] })
  type: string;

  @Prop({ index: '2dsphere' })
  coordinates: number[];

  formattedAddress: string;

  city: string;

  state: string;

  zipcode: string;

  country: string;
}

export enum Category {
  FAST_FOOD = 'Fast food',
  CAFE = 'Cafe',
  FINE_DINNING = 'Fine dinning',
}

@Schema({ timestamps: true })
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

  @Prop({ type: Object, ref: 'Location' })
  location: Location;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Meal' }])
  menu?: Menu[];
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);
