import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { CurrentUser } from '../auth/decorators/current_user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/schemas/user.schema';
import { Menu } from './schema/meal.schema';
import { CreateMenuDto } from './dto/create_menu_dto';
import { Query as ExpressQuery } from 'express-serve-static-core';

@Controller('meals/')
export class MenuController {
  constructor(private menuService: MenuService) {}

  @Post('create/')
  @UseGuards(AuthGuard())
  createMenu(
    @Body() meal: Menu,
    @CurrentUser()
    user: User,
  ): Promise<Menu> {
    return this.menuService.create(meal, user);
  }

  // Get all meals
  @Get('all')
  @UseGuards(AuthGuard())
  async getAllMenu(
    @CurrentUser() user: User,
    @Query() query: ExpressQuery,
  ): Promise<Menu[]> {
    return this.menuService.findAll(query);
  }

  @Get('menu-by-restaurant/:id')
  @UseGuards(AuthGuard())
  async getMenuById(@Param('id') id: string): Promise<Menu[]> {
    return this.menuService.findMealByRestaurantId(id);
  }

  // Post('update')
}
