import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Restaurant } from '../restaurants/schemas/restaurants.schema';
import * as mongoose from 'mongoose';
import { Query } from 'express-serve-static-core';
import ApiFeatures from 'src/utils/api_features.utils';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectModel(Restaurant.name)
    private restaurantModel: mongoose.Model<Restaurant>,
  ) {}

  // GET all Restaurant => GET /api/restaurants/all
  async findAll(query: Query): Promise<Restaurant[]> {
    const resultPerPage = 5;
    const currentPage = Number(query.page) || 1;
    const skip = resultPerPage * (currentPage - 1);

    const keyword = query.keyword
      ? {
          name: {
            $regex: query.keyword,
            $options: 'i',
          },
        }
      : {};

    const response = await this.restaurantModel
      .find({ ...keyword })
      .limit(resultPerPage)
      .skip(skip);
    return response;
  }

  // Create a new Restaurant => POST /api/restaurants/create
  async create(restaurant: Restaurant): Promise<Restaurant> {
    // generate the geolocation of the address and save it
    const location = await ApiFeatures.getRestaurantLocation(
      restaurant.address,
    );
    console.log(location);
    const response = await this.restaurantModel.create(restaurant);
    return response;
  }

  // GET Restaurant By Id => GET /api/restaurants/id
  async findById(restaurantId: string): Promise<Restaurant> {
    const isValidId = mongoose.isValidObjectId(restaurantId);
    if (!isValidId) {
      throw new BadRequestException('Invalid mongooes Id, Please a correct Id');
    }
    const response = await this.restaurantModel.findById(restaurantId);
    if (!response) {
      throw new NotFoundException('Restaurant not found');
    }
    return response;
  }

  // UPDATE Restaurant By Id => UPDATE /api/restaurant/id
  async updateById(id: string, restaurant: Restaurant): Promise<Restaurant> {
    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId) {
      throw new BadRequestException('Invalid mongooes Id, Please a correct Id');
    }
    const response = await this.restaurantModel.findById(id);
    if (!response) {
      throw new NotFoundException('Restaurant not found');
    }
    return await this.restaurantModel.findByIdAndUpdate(id, restaurant, {
      new: true,
      runValidators: true,
    });
  }

  //DELETE Restaurant By Id => DELETE /api/restaurant/id
  async deleteById(id: string): Promise<string> {
    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId) {
      throw new BadRequestException('Invalid mongooes Id, Please a correct Id');
    }
    const response = await this.restaurantModel.findById(id);
    if (!response) {
      throw new NotFoundException(
        "The Restaurant you want to delete doesn't exit",
      );
    }
    return await this.restaurantModel.findByIdAndDelete(id);
  }
}
