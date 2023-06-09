import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { MealService } from './meal.service';
import { CurrentUser } from '../auth/decorators/current_user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/schemas/user.schema';
import { Meal } from './schema/meal.schema';
import { CreateMealDto } from './dto/create-meal.dto';

@Controller('meals/')
export class MealController {
  constructor(private mealService: MealService) {}

  @Post('create/')
  @UseGuards(AuthGuard())
  createMeal(
    @Body() meal: Meal,
    @CurrentUser()
    user: User,
  ): Promise<Meal> {
    return this.mealService.create(meal, user);
  }

  // Get all meals
  @Get('all')
  async getAllMeal(): Promise<Meal[]> {
    return this.mealService.findAll();
  }

  @Get('meal/:id')
  async getMealsById(@Param('id') id: string): Promise<Meal[]> {
    return this.mealService.findMealByRestaurantId(id);
  }
}
