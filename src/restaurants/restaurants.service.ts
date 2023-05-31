import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Restaurant } from '../restaurants/schemas/restaurants.schema';
import * as mongoose from 'mongoose';
import { NotFoundError } from 'rxjs';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectModel(Restaurant.name)
    private restaurantModel: mongoose.Model<Restaurant>,
  ) {}

  // GET all Restaurant => GET /api/restaurants/all
  async findAll(): Promise<Restaurant[]> {
    const response = await this.restaurantModel.find();
    return response;
  }

  // Create a new Restaurant => POST /api/restaurants/create
  async create(restaurant: Restaurant): Promise<Restaurant> {
    const response = await this.restaurantModel.create(restaurant);
    return response;
  }

  // GET Restaurant By Id => GET /api/restaurants/id
  async findById(restaurantId: string): Promise<Restaurant> {
    const response = await this.restaurantModel.findById(restaurantId);
    if (!response) {
      throw new NotFoundException('Restaurant not found');
    }
    return response;
  }
}
