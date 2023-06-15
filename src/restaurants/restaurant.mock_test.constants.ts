import { User, UserRole, UserSchema } from '../auth/schemas/user.schema';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Category, Restaurant } from './schemas/restaurants.schema';

export const mockNewCreatedUser = {
  _id: '647e28234d7cd185e40d05a5',
  email: 'beta1@gmail.com',
  name: 'Ifeanyichukwu Obeta',
  password: 'ifeanyichukwu',
  role: UserRole.USER,
};

export const mockUser: User = {
  name: 'Buka Beans',
  email: 'beta1@gmail.com',
  password: 'ifeanyichukwu',
  role: UserRole.USER,
};

// instance of existing restaurant
export const existingRestaurant: Restaurant = {
  name: 'Buka Beans',
  description: "It's for people that are blessed, this is the description",
  email: 'beta1@gmail.com',
  phoneNumber: 9011111118,
  address: 'No 5A Road Nsukka',
  category: Category.FAST_FOOD,
  images: [],
  location: {
    type: 'Point',
    coordinates: [-74.38576, 40.886511],
    formattedAddress: '5a Grace Rd, Lake Hiawatha, NJ 07034, US',
    city: 'Lake Hiawatha',
    state: 'NJ',
    zipcode: '07034',
    country: 'US',
  },
  user: mockNewCreatedUser,
  menu: [],
};

// instance of create restaurant
export const createdRestaurant: Restaurant = {
  address: 'No 5A Road Nsukka',
  category: Category.FAST_FOOD,
  description: "It's for people that are blessed, this is the description",
  email: 'beta1@gmail.com',
  images: [],
  location: {
    type: 'Point',
    coordinates: [-74.38576, 40.886511],
    formattedAddress: '5a Grace Rd, Lake Hiawatha, NJ 07034, US',
    city: 'Lake Hiawatha',
    state: 'NJ',
    zipcode: '07034',
    country: 'US',
  },
  menu: [],
  name: 'Buka Beans',
  phoneNumber: 9011111118,
  user: mockNewCreatedUser,
};

export const mockRestaurantService = {
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
  findByIdAndDelete: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  updatedBy: jest.fn(),
  deleteById: jest.fn(),
};

export const mockNewRestaurant = {
  name: 'Chitis',
  description: "It's for people that are blessed, this is the description",
  email: 'beta1@gmail.com',
  phoneNumber: 9011111118,
  address: 'No 5A Road Nsukka',
  category: Category.FAST_FOOD,
};

export const mockNotFoundExceptionError = new NotFoundException(
  'Restaurant not found',
);

// check if restaurant already exist
export const mockForbiddenExceptionError = new ForbiddenException(
  'The name of the restaurant already exist please use another name',
);
