import { Body, Controller, Post, UseGuards } from '@nestjs/common';
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
    @Body() createMealDto: CreateMealDto,
    @CurrentUser()
    user: User,
  ): Promise<Meal> {
    return this.mealService.create(createMealDto, user);
  }
}
