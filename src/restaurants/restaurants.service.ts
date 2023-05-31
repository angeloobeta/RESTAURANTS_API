import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Restaurant } from '../restaurants/schemas/restaurants.schema';
import * as mongoose from 'mongoose';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectModel(Restaurant.name)
    private restaurantModel: mongoose.Model<Restaurant>,
  ) {}

  // GET all Restaurant => GET /api/restaurants/all
  async findAll(): Promise<Restaurant[]> {
    const restaurants = await this.restaurantModel.find();
    return restaurants;
  }

  // Create a new Restaurant => POST /api/restaurants
  async create(restaurant: Restaurant): Promise<Restaurant> {
    const response = await this.restaurantModel.create(restaurant);
    return response;
  }
}
