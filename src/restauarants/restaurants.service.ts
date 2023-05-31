import { Injectable } from '@nestjs/common';
import { InjectModel, MongooseModule } from '@nestjs/mongoose';
import { Restaurant } from './schemas/restaurants.schema';
import * as mongoose from 'mongoose';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectModel(Restaurant.name)
    private restaurantModel = mongoose.Model<Restaurant>,
  ) {}

  // GET all Restaurant => GET restaurants
  async findAll(): Promise<Restaurant[]> {
    const restaurants = await this.restaurantModel.find();
    return restaurants;
  }
}
