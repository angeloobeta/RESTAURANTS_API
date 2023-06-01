import { Query as ExpressQuery } from 'express-serve-static-core';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { Restaurant } from '../restaurants/schemas/restaurants.schema';
import { CreateRestaurantDto } from 'src/dto/create_restaurant.dto';
import { UpdateRestaurantDto } from 'src/dto/update_restaurant.dto';

@Controller('restaurants/')
export class RestaurantsController {
  constructor(private restaurantsService: RestaurantsService) {}

  @Get('all')
  async getAllRestaurant(@Query() query: ExpressQuery): Promise<Restaurant[]> {
    return this.restaurantsService.findAll(query);
  }

  @Post('create/')
  async createRestaurant(
    @Body()
    restaurant: CreateRestaurantDto,
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
    restaurant: UpdateRestaurantDto,
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
