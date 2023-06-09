import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Restaurant } from './schemas/restaurants.schema';
import * as mongoose from 'mongoose';
import { Query } from 'express-serve-static-core';
import { User } from '../auth/schemas/user.schema';
import ApiFeatures from '../utils/api_features.utils';
import { UpdateRestaurantDto } from 'src/restaurants/dto/update_restaurant.dto';
import { CurrentUser } from '../auth/decorators/current_user.decorator';
import { CreateRestaurantDto } from './dto/create_restaurant.dto';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectModel(Restaurant.name)
    private restaurantModel: mongoose.Model<Restaurant>,
  ) {}

  // GET all Restaurant => GET /api/restaurants/all
  async findAllRestaurant(query: Query): Promise<Restaurant[]> {
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

  // Get all restaurant to a particular user
  async findAllUserRestaurant(query: Query, user: User): Promise<Restaurant[]> {
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
      : { user: user.id };
    console.log(user.id);

    return this.restaurantModel
      .find({ ...keyword })
      .limit(resultPerPage)
      .skip(skip);
  }

  // Create a new Restaurant => POST /api/restaurants/create
  async createRestaurant(
    restaurant: CreateRestaurantDto,
    user: User,
  ): Promise<Restaurant> {
    // generate the geolocation of the address and save it
    const location = await ApiFeatures.getRestaurantLocation(
      restaurant.address,
    );
    console.log(location);

    const data = Object.assign(restaurant, { user: user._id, location });
    // check if name of the restaurant doesn't exit
    const restaurantNameExist = await this.restaurantModel.findOne({
      name: restaurant.name,
      user: user.id,
    });

    if (restaurantNameExist && user.email === restaurantNameExist.email) {
      throw new ForbiddenException(
        'The name of the restaurant already exist please use another name',
      );
    }

    return await this.restaurantModel.create(data);
  }

  // GET Restaurant By Id => GET /api/restaurants/id
  async findRestaurantById(restaurantId: string): Promise<Restaurant> {
    const isValidId = mongoose.isValidObjectId(restaurantId);
    if (!isValidId) {
      throw new BadRequestException('Invalid mongoose Id, Please a correct Id');
    }
    const response = await this.restaurantModel.findById(restaurantId);
    if (!response) {
      throw new NotFoundException('Restaurant not found');
    }
    return response;
  }

  // UPDATE Restaurant By Id => UPDATE /api/restaurant/id
  async updateRestaurantById(
    id: string,
    restaurant: UpdateRestaurantDto,
    user: User,
  ): Promise<Restaurant> {
    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId) {
      throw new BadRequestException(
        'Invalid mongoose Id, Please enter a correct Id',
      );
    }
    const response = await this.restaurantModel.findById(id);
    console.log(user._id.toString());
    if (!response) {
      throw new NotFoundException('Restaurant not found');
    }
    console.log(response.user);
    if (response.user !== user._id) {
      throw new ForbiddenException("You can't update this restaurant");
    }
    return this.restaurantModel.findByIdAndUpdate(id, restaurant, {
      new: true,
      runValidators: true,
    });
  }

  //DELETE Restaurant By Id => DELETE /api/restaurant/id
  async deleteRestaurantById(id: string): Promise<string> {
    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId) {
      throw new BadRequestException('Invalid mongoose Id, Please a correct Id');
    }
    const response = await this.restaurantModel.findById(id);
    if (!response) {
      throw new NotFoundException(
        "The Restaurant you want to delete doesn't exit",
      );
    }
    if (response.images.length == 0) {
      return '';
    } else {
      const isImagesDeleted = await ApiFeatures.deleteImages(response.images);
      if (isImagesDeleted) return this.restaurantModel.findByIdAndDelete(id);
    }
  }

  // PUT
  //upload image
  async uploadImage(id: string, files) {
    const images = await ApiFeatures.uploadImages(files);
    return this.restaurantModel.findByIdAndUpdate(
      id,
      { images: images as object[] },
      {
        new: true,
        runValidators: true,
      },
    );
  }

  // DELETE
  // delete image
  async deleteImage(images) {
    return ApiFeatures.deleteImages(images);
  }
}
