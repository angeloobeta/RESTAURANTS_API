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
  mockRestaurantService, mockNewRestaurant, mockUser, mockForbiddenExceptionError
} from "./restaurant.mock_test.constants";
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
    // restaurantModel = module.get<Model<Restaurant>>(getModelToken('Restaurant'));
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
      expect(restaurants).toEqual([existingRestaurant]);
    });
  });

  // createRestaurant
  describe('createRestaurant', () => {
    it('should get the user location', async () => {
      jest
        .spyOn(ApiFeatures, 'getRestaurantLocation')
        .mockImplementation(() => Promise.resolve(existingRestaurant.location));
    });

    it('should find that restaurant', async () => {
      jest
        .spyOn(restaurantModel, 'findOne')
        .mockResolvedValue(() => Promise.resolve(existingRestaurant));
    });

    it('should check if the restaurant has already been created', () => {
      expect(async () => {
        const createRestaurant = await restaurantsService.createRestaurant(
          mockNewRestaurant,
          mockUser,
        );

        // check if created restaurant already exist
        if (createRestaurant.name !== existingRestaurant.name) {
          throw mockForbiddenExceptionError;
        }
      }).rejects.toThrow(mockForbiddenExceptionError);
    });

    it('should create a new restaurant', async () => {
      jest
        .spyOn(restaurantModel, 'create')
        .mockImplementationOnce(() =>
          Promise.resolve(mockNewRestaurant as any),
        );
      const result = await restaurantModel.create(
        mockNewRestaurant as any,
        mockNewCreatedUser as any,
      );
      expect(result).toEqual(existingRestaurant);
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

  // deleteById
  describe('deleteById', () => {
    it('should throw wrong mongoose id', async () => {
      await expect(
        restaurantsService.findRestaurantById('wrong id'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw restaurant not found error', async () => {
      const mockError = new NotFoundException(
        "The Restaurant you want to delete doesn't exit",
      );
      jest.spyOn(restaurantModel, 'findById').mockRejectedValue(mockError);
      await expect(
        restaurantsService.findRestaurantById(existingRestaurant._id),
      ).rejects.toThrow(NotFoundException);
    });

    it('should delete a restaurant by its Id', async () => {
      jest
        .spyOn(restaurantModel, 'findByIdAndDelete')
        .mockResolvedValueOnce(existingRestaurant as any);

      const result = await restaurantsService.deleteRestaurantById(
        existingRestaurant._id,
      );
      expect(result).toEqual(existingRestaurant);
    });
  });

  // upload images
  describe('uploadImages', () => {
    it('should upload images to S3 Bucket', async () => {
      const mockImages = [
        {
          Etag: '"jkffdddfdffgggffdfddf"',
          location:
            'https://restaurant-api-bucket.s3.amazon.com/restaurant-images',
          key: 'restaurant-image-1.png',
          Key: 'restaurant-image-2.png',
          Bucket: 'restaurant-bucket',
        },
      ];

      const updatedRestaurant = { ...existingRestaurant, images: mockImages };

      jest.spyOn(ApiFeatures, 'uploadImages').mockResolvedValue(mockImages);
      jest
        .spyOn(restaurantModel, 'findByIdAndUpdate')
        .mockResolvedValueOnce(updatedRestaurant as any);

      const file = [
        {
          fieldname: 'files',
          originalname: 'README.md',
          encoding: '7bit',
          mimetype: 'text/markdown',
          buffer:
            '<Buffer 23 20 43 6f 64 69 6e 67 20 49 6e 74 65 72 76 69 65 77 20 55 6e 69 76 65 72 73 69 74 79 0a 0a 3e 20 49 20 6f 72 69 67 69 6e 61 6c 6c 79 20 63 72 65 61 ... 141789 more bytes>',
          size: 141839,
        },
      ];

      const result = await restaurantsService.uploadImage(
        existingRestaurant._id,
        file,
      );
      expect(result).toEqual(updatedRestaurant);
    });
  });

  // delete images
  describe('deleteImages', () => {
    it('should delete images from s3 bucket', async () => {
      const mockImages = [
        {
          Etag: '"jkffdddfdffgggffdfddf"',
          location:
            'https://restaurant-api-bucket.s3.amazon.com/restaurant-images',
          key: 'restaurant-image-1.png',
          Key: 'restaurant-image-2.png',
          Bucket: 'restaurant-bucket',
        },
      ];
      jest.spyOn(ApiFeatures, 'deleteImages').mockResolvedValue(true);
      const result = await restaurantsService.deleteImage(mockImages);
      expect(result).toBe(true);
    });
  });

  describe('deleteById', () => {
    it('should throw wrong mongoose id', async () => {
      await expect(
        restaurantsService.findRestaurantById('wrong id'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw restaurant not found error', async () => {
      const mockError = new NotFoundException(
        "The Restaurant you want to delete doesn't exit",
      );
      jest
        .spyOn(restaurantModel, 'findByIdAndDelete')
        .mockRejectedValue(mockError);
      await expect(
        restaurantsService.findRestaurantById(existingRestaurant._id),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
