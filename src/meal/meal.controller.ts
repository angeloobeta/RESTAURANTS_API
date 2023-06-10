import { Body, Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { MealService } from './meal.service';
import { CurrentUser } from '../auth/decorators/current_user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/schemas/user.schema';
import { Meal } from './schema/meal.schema';
import { CreateMealDto } from './dto/create-meal.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';

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
  @UseGuards(AuthGuard())
  async getAllMeal(
    @CurrentUser() user: User,
    @Query() query: ExpressQuery,
  ): Promise<Meal[]> {
    return this.mealService.findAll(query);
  }

  @Get('meal-by-restaurant/:id')
  @UseGuards(AuthGuard())
  async getMealsById(@Param('id') id: string): Promise<Meal[]> {
    return this.mealService.findMealByRestaurantId(id);
  }
}
