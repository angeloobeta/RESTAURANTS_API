import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { CurrentUser } from '../auth/decorators/current_user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/schemas/user.schema';
import { Menu } from './schema/menu.schema';
import { CreateMenuDto } from './dto/create_menu_dto';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { UpdateMenuDto } from './dto/update_menu.dto';

@Controller('meals/')
export class MenuController {
  constructor(private menuService: MenuService) {}

  @Post('create/')
  @UseGuards(AuthGuard())
  createMenu(
    @Body() menu: Menu,
    @CurrentUser()
    user: User,
  ): Promise<Menu> {
    return this.menuService.create(menu, user);
  }

  // Fetch all menu
  @Get('all')
  @UseGuards(AuthGuard())
  async getAllMenu(
    @CurrentUser() user: User,
    @Query() query: ExpressQuery,
  ): Promise<Menu[]> {
    return this.menuService.findAll(query);
  }

  // Fetch menu by restaurant id
  @Get('menu-by-restaurant/:id')
  @UseGuards(AuthGuard())
  async getMenuById(@Param('id') id: string): Promise<Menu[]> {
    return this.menuService.findMealByRestaurantId(id);
  }

  // Update menu
  // eslint-disable-next-line prettier/prettier
  @Put('update/id')
  @UseGuards(AuthGuard())
  async updateMenuById(
    @Param('id')
    id: string,
    @Body()
    menu: UpdateMenuDto,
    user: User,
  ): Promise<Menu> {
    return this.menuService.update(id, menu, user);
  }
}
