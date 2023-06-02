import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Restaurant } from './schemas/restaurants.schema';
import * as mongoose from 'mongoose';
import { Query } from 'express-serve-static-core';
import ApiFeatures from 'src/utils/api_features.utils';
import { CreateRestaurantDto } from 'src/dto/create_restaurant.dto';
import { UpdateRestaurantDto } from 'src/dto/update_restaurant.dto';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectModel(Restaurant.name)
    private restaurantModel: mongoose.Model<Restaurant>,
  ) {}

  // GET all Restaurant => GET /api/restaurants/all
  async findAll(query: Query): Promise<Restaurant[]> {
    // const resultPerPage = 5;
    const resultPerPage = null;
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

    return this.restaurantModel
      .find({ ...keyword })
      .limit(resultPerPage)
      .skip(skip);
  }

  // Create a new Restaurant => POST /api/restaurants/create
  async create(restaurant: CreateRestaurantDto): Promise<Restaurant> {
    // generate the geolocation of the address and save it
    const location = await ApiFeatures.getRestaurantLocation(
      restaurant.address,
    );
    console.log(location);

    const data = Object.assign(restaurant, { location });

    return await this.restaurantModel.create(data);
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
  async updateById(
    id: string,
    restaurant: UpdateRestaurantDto,
  ): Promise<Restaurant> {
    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId) {
      throw new BadRequestException('Invalid mongooes Id, Please a correct Id');
    }
    const response = await this.restaurantModel.findById(id);
    if (!response) {
      throw new NotFoundException('Restaurant not found');
    }
    return this.restaurantModel.findByIdAndUpdate(id, restaurant, {
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
    return this.restaurantModel.findByIdAndDelete(id);
  }

  // PUT
  //upload image
  async uploadImage(id: string, files) {
    const images = await ApiFeatures.uploadImages(files);
    console.log(images);
    return images;
  }
}
