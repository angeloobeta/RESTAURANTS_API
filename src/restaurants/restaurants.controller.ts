import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
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

  @Put('update/:id')
  async updateRestaurantById(
    @Param('id')
    id: string,
    @Body()
    restaurant: RestaurantDto,
  ): Promise<Restaurant> {
    return this.restaurantsService.updateById(id, restaurant);
  }

  @Delete('delete/:id')
  async deleteRestaurantById(
    @Param('id')
    id: string,
  ): Promise<{ deleted: boolean }> {
    const response = await this.restaurantsService.deleteById(id);
    if (response) {
      return { deleted: true };
    }
  }
}
