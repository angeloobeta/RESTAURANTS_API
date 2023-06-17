import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantsService } from './restaurants.service';
import { getModelToken } from '@nestjs/mongoose';
import { Restaurant } from './schemas/restaurants.schema';
import ApiFeatures from '../utils/api_features.utils';
import {
  mockNewCreatedUser,
  mockNotFoundExceptionError,
  createdRestaurant,
  existingRestaurant,
  mockRestaurantService,
  mockNewRestaurant,
  mockUser,
  mockForbiddenExceptionError,
} from './restaurant.mock_test.constants';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';

describe('RestaurantService', () => {
  let restaurantsService: RestaurantsService;
  let restaurantModel: Model<Restaurant>;

  // function to run before each unit test
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestaurantsService,
        {
          provide: getModelToken(Restaurant.name),
          // provide: getModelToken('Restaurant'),
          useValue: mockRestaurantService,
        },
      ],
    }).compile();

    restaurantsService = module.get<RestaurantsService>(RestaurantsService);
    restaurantModel = module.get<Model<Restaurant>>(
      getModelToken(Restaurant.name),
    );
    // restaurantModel = module.get<Model<Restaurant>>(
    //   getModelToken('Restaurant'),
    // );
  });

  it('should be defined', () => {
    expect(restaurantsService).toBeDefined();
  });

  // findAllRestaurant
  describe('findAllRestaurant', () => {
    it('should fetch all the restaurants', async () => {
      jest.spyOn(restaurantModel, 'find').mockImplementationOnce(
        () =>
          ({
            limit: () => ({
              skip: jest.fn().mockResolvedValue([existingRestaurant]),
            }),
          } as any),
      );

      const restaurants = await restaurantsService.findAllRestaurant({
        keyword: 'restaurant',
      });
      console.log('restaurant: ', restaurants);
      console.log('existingRestaurant', existingRestaurant);
      expect(restaurants).toEqual([existingRestaurant]);
    });
  });

  // createRestaurant
  describe('createRestaurant', () => {
    it('should get the user location', async () => {
      // if I don't write the jest.spyOn of the ApiFeature
      // when I call the iaj
      jest
        .spyOn(ApiFeatures, 'getRestaurantLocation')
        .mockImplementation(() => Promise.resolve(existingRestaurant.location));
      const locationData = await ApiFeatures.getRestaurantLocation(
        existingRestaurant.address,
      );
      console.log('location Info: ', locationData);
    });

    it('should find that restaurant', async () => {
      jest
        .spyOn(restaurantModel, 'findOne')
        .mockResolvedValue(() => Promise.resolve(existingRestaurant));
    });

    it('should check if the restaurant has already been created', async () => {
      const findOneMock = jest
        .spyOn(restaurantModel, 'findOne')
        .mockResolvedValue(createdRestaurant);

      await expect(async () => {
        const restaurantNameExist = await restaurantModel.findOne({
          name: createdRestaurant.name,
          user: createdRestaurant.user,
        });
        console.log('restaurantNameExist:', restaurantNameExist);
        console.log('mockUser.email:', mockUser.email);
        console.log('mockUser.email:', restaurantNameExist.email);
        if (
          restaurantNameExist &&
          mockUser.email === restaurantNameExist.email
        ) {
          throw mockForbiddenExceptionError;
        }
        throw new Error('Expected error was not thrown');
      }).rejects.toThrow(mockForbiddenExceptionError);
    });

    it('should create a new restaurant', async () => {
      jest
        .spyOn(ApiFeatures, 'getRestaurantLocation')
        .mockImplementation(() => Promise.resolve(existingRestaurant.location));
      const locationData = await ApiFeatures.getRestaurantLocation(
        existingRestaurant.address,
      );
      console.log('location Info: ', locationData);
      jest
        .spyOn(restaurantModel, 'create')
        .mockImplementationOnce(() =>
          Promise.resolve(mockNewRestaurant as any),
        );
      const result = await restaurantModel.create(
        mockNewRestaurant as any,
        mockNewCreatedUser as any,
      );
      const userData = Object.assign(result, { location: locationData });
      expect(existingRestaurant).toEqual(userData);
      console.log('result:', userData);
    });
  });

  // findById
  describe('findById', () => {
    it('should get restaurant by Id', async () => {
      jest
        .spyOn(restaurantModel, 'findById')
        .mockResolvedValueOnce(existingRestaurant as any);
      const result = await restaurantsService.findRestaurantById(
        existingRestaurant._id,
      );
      expect(result).toEqual(existingRestaurant);
    });

    // check the id
    it('should throw wrong mongoose id', async () => {
      await expect(
        restaurantsService.findRestaurantById('wrong id'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw restaurant not found error', async () => {
      const mockError = new NotFoundException('Restaurant not found');
      jest.spyOn(restaurantModel, 'findById').mockRejectedValue(mockError);
      await expect(
        restaurantsService.findRestaurantById(existingRestaurant._id),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // updateById
  describe('updateById', () => {
    // check if id is valid
    it('should throw wrong mongoose id', async () => {
      await expect(
        restaurantsService.findRestaurantById('wrong id'),
      ).rejects.toThrow(BadRequestException);
    });
    // check if id exist
    it('should throw restaurant not found error', async () => {
      jest
        .spyOn(restaurantModel, 'findById')
        .mockRejectedValue(mockNotFoundExceptionError);
      await expect(
        restaurantsService.findRestaurantById(existingRestaurant._id),
      ).rejects.toThrow(NotFoundException);
    });
    //update the restaurant
    it('should update the restaurant', async () => {
      //
      const restaurant = { ...existingRestaurant, name: 'Blessed Restaurant' };
      const updateRestaurant = { name: 'Updated Restaurant name' };
      jest
        .spyOn(restaurantModel, 'findByIdAndUpdate')
        .mockResolvedValueOnce(updateRestaurant as any);
      const updatedRestaurant = await restaurantsService.updateRestaurantById(
        restaurant._id,
        updateRestaurant as any,
        mockNewCreatedUser as any,
      );

      expect(updatedRestaurant.name).toEqual(updateRestaurant.name);
    });
  });
});
