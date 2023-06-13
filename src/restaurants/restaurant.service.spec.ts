import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantsService } from './restaurants.service';
import { getModelToken } from '@nestjs/mongoose';
import { Restaurant } from './schemas/restaurants.schema';
import mongoose, { Model } from 'mongoose';
import { UserRole } from '../auth/schemas/user.schema';
import ApiFeatures from '../utils/api_features.utils';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const mockRestaurantService = {
  find: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
  findOne: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
};

const mockRestaurant = {
  _id: '648343fb3e045358b81c722a',
  name: 'Blessed Restaurant ',
  description: "It's for people that are blessed, this is the description",
  email: 'betabyte@gmail.com',
  phoneNumber: 9011111118,
  address: 'No 5A Road Nsukka',
  category: 'Fast food',
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
  user: '6482d72b23bb1d317acaa140',
  menu: [],
};

const mockUser = {
  _id: '647e28234d7cd185e40d05a5',
  email: 'beta1@gmail.com',
  name: 'Ifeanyichukwu Obeta',
  role: UserRole.USER,
};

const newRestaurant = {
  name: 'Chitis',
  description: "It's for people that are blessed, this is the description",
  email: 'beta1@gmail.com',
  phoneNumber: 9011111118,
  address: 'No 5A Road Nsukka',
  category: 'Fast food',
};

const updateRestaurant = { name: 'Blessed Restaurant' };
const restaurant = { ...mockRestaurant, name: 'Blessed Restaurant' };
describe('RestaurantService', () => {
  let service: RestaurantsService;
  let model: Model<Restaurant>;

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

    service = module.get<RestaurantsService>(RestaurantsService);
    model = module.get<Model<Restaurant>>(getModelToken(Restaurant.name));
    // model = module.get<Model<Restaurant>>(getModelToken('Restaurant'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // findAll
  describe('findAll', () => {
    it('should get all restaurant', async () => {
      jest.spyOn(model, 'find').mockImplementationOnce(
        () =>
          ({
            limit: () => ({
              skip: jest.fn().mockResolvedValue([mockRestaurant]),
            }),
          } as any),
      );

      const restaurants = await service.findAll({ keyword: 'restaurant' });
      expect(restaurants).toEqual([mockRestaurant]);
    });
  });

  // create
  describe('create', () => {
    it('should create a new restaurant', async () => {
      jest
        .spyOn(ApiFeatures, 'getRestaurantLocation')
        .mockImplementation(() => Promise.resolve(mockRestaurant.location));

      // jest.spyOn(model, 'create').mockResolvedValueOnce(mockRestaurant as any);
      jest
        .spyOn(model, 'create')
        .mockImplementationOnce(() => Promise.resolve(mockRestaurant as any));
      const result = await service.create(
        newRestaurant as any,
        mockUser as any,
      );
      expect(result).toEqual(mockRestaurant);
    });
  });

  // findById
  describe('findById', () => {
    it('should get restaurant by Id', async () => {
      jest
        .spyOn(model, 'findById')
        .mockResolvedValueOnce(mockRestaurant as any);
      const result = await service.findById(mockRestaurant._id);
      expect(result).toEqual(mockRestaurant);
    });

    // check the id
    it('should throw wrong mongoose id', async () => {
      await expect(service.findById('wrong id')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw restaurant not found error', async () => {
      const mockError = new NotFoundException('Restaurant not found');
      jest.spyOn(model, 'findById').mockRejectedValue(mockError);
      await expect(service.findById(mockRestaurant._id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // updateById
  // describe('updateById', () => {
  //   //update the restaurant
  //   it('should update the restaurant', async () => {
  //     jest
  //       .spyOn(model, 'findByIdAndUpdate')
  //       .mockResolvedValueOnce(updateRestaurant as any);
  //
  //     //
  //     const updatedRestaurant = await service.updateById(
  //       restaurant._id,
  //       updateRestaurant as any,
  //       mockUser as any,
  //     );
  //
  //     expect(updatedRestaurant.name).toEqual(updateRestaurant.name);
  //   });
  //   // check if id is valid
  //   it('should throw wrong mongoose id', async () => {
  //     await expect(service.findById('wrong id')).rejects.toThrow(
  //       BadRequestException,
  //     );
  //   });
  //   // check if id exist
  //   // it('should throw restaurant not found error', async () => {
  //   //   jest.spyOn(model, 'findById').mockRejectedValue(mockError);
  //   //   await expect(service.findById(mockRestaurant._id)).rejects.toThrow(
  //   //     NotFoundException,
  //   //   );
  //   // });
  // });

  // deleteById
  // describe('deleteById', () => {
  //   it('should delete a restaurant by its Id', async () => {
  //     jest
  //       .spyOn(model, 'findByIdAndDelete')
  //       .mockResolvedValueOnce(mockRestaurant as any);
  //
  //     const result = service.deleteById(mockRestaurant._id);
  //     expect(result).toEqual(mockRestaurant);
  //   });
  // });

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

      const updateRestaurant = { ...mockRestaurant, images: mockImages };

      jest.spyOn(ApiFeatures, 'uploadImages').mockResolvedValue(mockImages);
      jest
        .spyOn(model, 'findByIdAndUpdate')
        .mockResolvedValueOnce(updateRestaurant as any);

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

      const result = await service.uploadImage(mockRestaurant._id, file);
      expect(result).toEqual(updateRestaurant);
    });
  });
});
