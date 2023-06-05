import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Meal } from './schema/meal.schema';
import * as mongoose from 'mongoose';
import { User } from '../auth/schemas/user.schema';
import { Restaurant } from '../restaurants/schemas/restaurants.schema';

@Injectable()
export class MealService {
  constructor(
    @InjectModel(Meal.name)
    private mealModel: mongoose.Model<Meal>,
    @InjectModel(Restaurant.name)
    private restaurantModel: mongoose.Model<Restaurant>,
  ) {}


  // create a new meal
  async create(meal: Meal, user: User): Promise<Meal>{
    const data = Object.assign(meal, { user: user._id });
    const mealCreated = await this.mealModel.create(data);

    if(!mealCreated){
      throw new NotFoundException('Restaurant found by 2d');
    }

    // saving meal Id in the restaurant erra
  }
}
