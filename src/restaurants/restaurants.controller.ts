import { Body, Controller, Get, Post } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { Restaurant } from '../restaurants/schemas/restaurants.schema';

@Controller('/api/restaurants/')
export class RestaurantsController {
  constructor(private restaurantsService: RestaurantsService) {}

  @Get('all/')
  async getAllRestaurant(): Promise<Restaurant[]> {
    return this.restaurantsService.findAll();
  }

  @Post('create/')
  async createRestaurant(
    @Body()
    restaurant,
  ): Promise<Restaurant> {
    return this.restaurantsService.create(restaurant);
  }
}
