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

@Injectable()
export class MealService {
  constructor(
    @InjectModel(Meal.name)
    private mealModel: mongoose.Model<Meal>,
    @InjectModel(Restaurant.name)
    private restaurantModel: mongoose.Model<Restaurant>,
  ) {}

  // create a new meal
  async create(meal: CreateMealDto, user: User): Promise<Meal> {
    const data = Object.assign(meal, { user: user._id });

    // saving meal Id to restaurant menu
    const restaurant = await this.restaurantModel.findById(meal.restaurant);

    if (restaurant) {
      throw new NotFoundException('Restaurant not found by this Id');
    }

    // check ownership of the restaurant
    if (restaurant.user.toString() !== user._id.toString()) {
      throw new ForbiddenException("You can't add meal to this restaurant");
    }
    const mealCreated = await this.mealModel.create(data);

    restaurant.menu.push(mealCreated);
    restaurant.save();
    return mealCreated;
  }
}
