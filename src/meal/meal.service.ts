import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Meal } from './schema/meal.schema';
import * as mongoose from 'mongoose';
import { User } from '../auth/schemas/user.schema';
import { Restaurant } from '../restaurants/schemas/restaurants.schema';
import { CreateMealDto } from './dto/create-meal.dto';
import { Query } from 'express-serve-static-core';

@Injectable()
export class MealService {
  constructor(
    @InjectModel(Meal.name)
    private mealModel: mongoose.Model<Meal>,
    @InjectModel(Restaurant.name)
    private restaurantModel: mongoose.Model<Restaurant>,
  ) {}

  // Get all meals
  async findAll(query: Query): Promise<Meal[]> {
    const resultPerPage = null;
    const currentPage = Number(query.page) || 1;
    const skip = resultPerPage * (currentPage - 1);

    // search keyword
    const keyword = query.keyword
      ? {
          name: { $regex: query.keyword, $options: 'i' },
          description: { $regex: query.keyword, $options: 'i' },

    }
      : {};

    return this.mealModel
      .find({ ...keyword })
      .limit(resultPerPage)
      .skip(skip);
  }

  // Get all meals for a restaurant
  async findMealByRestaurantId(id: string): Promise<Meal[]> {
    return this.mealModel.find({ restaurant: id });
  }

  async findMealBySearchWord(query: Query): Promise<Meal[]> {
    const resultPerPage = null;
    const currentPage = Number(query.page) || 1;
    const skip = resultPerPage * (currentPage - 1);

    const keyword = query.keyword
      ? {
          name: { $regex: query.keyword, $options: 'i' },
          description: { $regex: query.keyword, $options: 'i' },
        }
      : {};

    return this.mealModel
      .find({ ...keyword })
      .limit(resultPerPage)
      .skip(skip);
  }

  // create a new meal
  async create(meal: CreateMealDto, user: User): Promise<Meal> {
    const data = Object.assign(meal, { user: user._id });

    // saving meal Id to restaurant menu
    const restaurant = await this.restaurantModel.findById(meal.restaurant);

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found by this Id');
    }

    // check ownership of the restaurant
    // console.log(restaurant._id);
    console.log(restaurant.user.toString());
    console.log(user._id.toString());
    console.log(user.id);
    if (restaurant.user.toString() !== user._id.toString()) {
      throw new ForbiddenException("You can't add meal to this restaurant");
    }
    const mealCreated = await this.mealModel.create(data);

    restaurant.menu.push(mealCreated);
    restaurant.save();
    return mealCreated;
  }
}
