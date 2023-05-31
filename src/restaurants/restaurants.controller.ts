import { Body, Controller, Get, Post } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { Restaurant } from '../restaurants/schemas/restaurants.schema';
import { RestaurantDto } from 'src/dto/restaurant.dto';

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
    restaurant: RestaurantDto,
  ): Promise<Restaurant> {
    return this.restaurantsService.create(restaurant);
  }
}
