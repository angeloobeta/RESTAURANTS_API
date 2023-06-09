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
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { Restaurant } from './schemas/restaurants.schema';
import { CreateRestaurantDto } from './dto/create_restaurant.dto';
import { UpdateRestaurantDto } from './dto/update_restaurant.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/decorators/current_user.decorator';
import { User } from '../auth/schemas/user.schema';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';

@Controller('restaurants/')
export class RestaurantsController {
  constructor(private restaurantsService: RestaurantsService) {}

  @Get('all')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles('admin', 'user')
  async getAllRestaurant(
    @CurrentUser() user: User,
    @Query() query: ExpressQuery,
  ): Promise<Restaurant[]> {
    // console.log(user.email.toString());
    return this.restaurantsService.findAllRestaurant(query);
  }

  @Get('user-restaurant/')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles('admin', 'user')
  async getAllUserRestaurant(
    @CurrentUser() user: User,
    @Query() query: ExpressQuery,
  ): Promise<Restaurant[]> {
    return this.restaurantsService.findAllUserRestaurant(query, user);
  }

  @Post('create/')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles('admin', 'user')
  async createRestaurant(
    @CurrentUser() user: User,
    @Body()
    restaurant: CreateRestaurantDto,
  ): Promise<Restaurant> {
    return this.restaurantsService.createRestaurant(restaurant, user);
  }

  @Get(':id')
  async getRestaurantById(
    @Param('id')
    id: string,
  ): Promise<Restaurant> {
    return this.restaurantsService.findRestaurantById(id);
  }

  @Put('update/:id')
  @UseGuards(AuthGuard())
  async updateRestaurantById(
    @Param('id')
    id: string,
    @Body()
    restaurant: UpdateRestaurantDto,
    @CurrentUser() user: User,
  ): Promise<Restaurant> {
    // if (response.user !== user._id.toString()) {
    //   throw new ForbiddenException("You can't update the user");
    // }
    return this.restaurantsService.updateRestaurantById(id, restaurant, user);
  }

  @Delete('delete/:id')
  async deleteRestaurantById(
    @Param('id')
    id: string,
  ): Promise<{ deleted: boolean }> {
    const response = await this.restaurantsService.deleteRestaurantById(id);
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
    console.log(files);
    await this.restaurantsService.findRestaurantById(id);
    return await this.restaurantsService.uploadImage(id, files);
  }
}
