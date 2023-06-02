import { Query as ExpressQuery } from "express-serve-static-core";
import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { RestaurantsService } from "./restaurants.service";
import { Restaurant } from "./schemas/restaurants.schema";
import { CreateRestaurantDto } from "../dto/create_restaurant.dto";
import { UpdateRestaurantDto } from "../dto/update_restaurant.dto";
import { FilesInterceptor } from "@nestjs/platform-express";

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
    } else {
      return { deleted: false };
    }
  }

  @Put('uploadImages/:id')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(
    @Param('id') id: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    // console.log(id);
    // console.log(files);
    await this.restaurantsService.findById(id);
    return await this.restaurantsService.uploadImage(id, files);
  }
}
