import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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

  @Get(':id')
  async getRestaurantById(
    @Param('id')
    id: string,
  ): Promise<Restaurant> {
    return this.restaurantsService.findById(id);
  }
}
