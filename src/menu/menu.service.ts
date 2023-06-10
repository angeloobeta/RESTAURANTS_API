import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Menu } from './schema/menu.schema';
import * as mongoose from 'mongoose';
import { User } from '../auth/schemas/user.schema';
import { Restaurant } from '../restaurants/schemas/restaurants.schema';
import { CreateMenuDto } from './dto/create_menu_dto';
import { Query } from 'express-serve-static-core';
import { UpdateMenuDto } from './dto/update_menu.dto';

@Injectable()
export class MenuService {
  constructor(
    @InjectModel(Menu.name)
    private menuModel: mongoose.Model<Menu>,
    @InjectModel(Restaurant.name)
    private restaurantModel: mongoose.Model<Restaurant>,
  ) {}

  // Get all meals
  async findAll(query: Query): Promise<Menu[]> {
    const resultPerPage = null;
    const currentPage = Number(query.page) || 1;
    const skip = resultPerPage * (currentPage - 1);

    // search keyword
    const keyword = query.keyword
      ? {
          name: { $regex: query.keyword, $options: 'i' },
          description: { $regex: query.keyword, $options: 'i' },
        }
      : {};

    return this.menuModel
      .find({ ...keyword })
      .limit(resultPerPage)
      .skip(skip);
  }

  // Get all meals for a restaurant
  async findMealByRestaurantId(id: string): Promise<Menu[]> {
    return this.menuModel.find({ restaurant: id });
  }

  // create a new meal
  async create(menu: Menu, user: User): Promise<Menu> {
    const data = Object.assign(menu, { user: user._id });

    // delete restaurant and all it details

    // saving meal Id to restaurant menu
    const restaurant = await this.restaurantModel.findById(menu.restaurant);

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found by this Id');
    }

    // check ownership of the restaurant
    // console.log(restaurant._id);
    // console.log(restaurant.user.toString());
    // console.log(user._id.toString());
    // console.log(user.id);
    if (restaurant.user.toString() !== user._id.toString()) {
      throw new ForbiddenException("You can't add menu to this restaurant");
    }

    const menuNameExist = await this.menuModel.findOne({
      restaurant: menu.restaurant,
      user: menu.user,
    });

    // check if the menu already exits
    // console.log(menu.user);
    // console.log(menuNameExist.user);
    if (
      menuNameExist &&
      menu.user.toString() === menuNameExist.user.toString()
    ) {
      throw new ForbiddenException(
        'The menu already exist please use another name',
      );
    }

    const menuCreated = await this.menuModel.create(data);

    restaurant.menu.push(menuCreated);
    restaurant.save();
    return menuCreated;
  }

  async update(id: string, menu: Menu, user: User): Promise<Menu> {
    const isValid = mongoose.isValidObjectId(id);
    if (!isValid) {
      throw new BadRequestException(
        'Invalid mongoose Id, Please enter a correct Id',
      );
    }

    const response = await this.menuModel.findById(id);
    if (!response) {
      throw new NotFoundException('Menu not found');
    }
    console.log(user.id);
    console.log(response.user.toString());
    if (response.user.toString() !== user.id) {
      throw new ForbiddenException("You can't update this menu");
    }
    return this.menuModel.findByIdAndUpdate(id, menu, {
      new: true,
      runValidators: true,
    });
  }
}
