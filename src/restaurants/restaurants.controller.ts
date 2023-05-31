import { Controller, Get } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { Restaurant } from '../restaurants/schemas/restaurants.schema';

@Controller('/api/restaurants/')
export class RestaurantsController {
  constructor(private restaurantsService: RestaurantsService) {}

  @Get('all/')
  async getAllRestaurant(): Promise<Restaurant[]> {
    return this.restaurantsService.findAll();
  }
}
