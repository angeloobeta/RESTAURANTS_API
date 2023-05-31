import { Controller, Get } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { Restaurant } from './schemas/restaurants.schema';

@Controller('/api/restuarants/')
export class RestaurantsController {
  constructor(private restaurantsService: RestaurantsService) {}

  @Get('all/')
  async getAllRestaurant(): Promise<Restaurant[]> {
    return this.restaurantsService.findAll();
  }
}
