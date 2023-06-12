import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantsService } from './restaurants.service';
import { getModelToken } from '@nestjs/mongoose';
import { Restaurant } from './schemas/restaurants.schema';
import { Model } from 'mongoose';
import { UserRole } from '../auth/schemas/user.schema';
import ApiFeatures from '../utils/api_features.utils';

const mockRestaurantService = {
  find: jest.fn(),
  create: jest.fn(),
};
// const mockRestaurant = {
//   name: 'Chitis',
//   description: "It's for people that are blessed, this is the description",
//   email: 'beta1@gmail.com',
//   phoneNumber: 9011111118,
//   address: 'No 5A Road Nsukka',
//   category: 'Fast food',
//   location: {},
//   images: [],
//   user: '647e28234d7cd185e40d05a5',
//   menu: [],
//   _id: '64860a63ff80696fec1cd9f2',
//   createdAt: '2023-06-11T17:54:43.259Z',
//   updatedAt: '2023-06-11T17:54:43.259Z',
// };

// const mockRestaurant = {
//   name: 'Blessed Restaurant ',
//   description: "It's for people that are blessed, this is the description",
//   email: 'betabyte@gmail.com',
//   phoneNumber: 9011111118,
//   address: 'No 5A Road Nsukka',
//   category: 'Fast food',
//   images: [],
//   location: {
//     type: 'Point',
//     coordinates: [-74.38576, 40.886511],
//     formattedAddress: '5a Grace Rd, Lake Hiawatha, NJ 07034, US',
//     city: 'Lake Hiawatha',
//     state: 'NJ',
//     zipcode: '07034',
//     country: 'US',
//   },
// }

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
  user: '647e28234d7cd185e40d05a5',
  email: 'beta1@gmail.com',
  name: 'Ifeanyichukwu Obeta',
  role: UserRole.USER,
};

describe('RestaurantService', () => {
  let service: RestaurantsService;
  let model: Model<Restaurant>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestaurantsService,
        {
          provide: getModelToken(Restaurant.name),
          useValue: mockRestaurantService,
        },
      ],
    }).compile();

    service = module.get<RestaurantsService>(RestaurantsService);
    model = module.get<Model<Restaurant>>(getModelToken(Restaurant.name));
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
      expect(restaurants).toEqual(mockRestaurant);
    });
  });

  // create
  describe('create', () => {
    const newRestaurant = {
      name: 'Chitis',
      description: "It's for people that are blessed, this is the description",
      email: 'beta1@gmail.com',
      phoneNumber: 9011111118,
      address: 'No 5A Road Nsukka',
      category: 'Fast food',
    };

    it('should create a new restaurant', async () => {
      jest
        .spyOn(ApiFeatures, 'getRestaurantLocation')
        .mockImplementationOnce(() => Promise.resolve(mockRestaurant.location));

      jest
        .spyOn(model, 'create')
        .mockImplementationOnce(() => Promise.resolve(mockRestaurant));

      const result = service.create(newRestaurant as any, mockUser as any);
      expect(result).toEqual(mockRestaurant);
    });
  });
});
