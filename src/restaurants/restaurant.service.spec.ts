import { Test, TestingModule} from '@nestjs/testing';
import { RestaurantsService } from './restaurants.service';
import { getModelToken } from '@nestjs/mongoose';
import { Restaurant } from './schemas/restaurants.schema';
import { Model } from 'mongoose';

const mockRestaurantService = {
  find: jest.fn(),
};
const mockRestaurant = {
  "name": "Chitis",
  "description": "It's for people that are blessed, this is the description",
  "email": "beta1@gmail.com",
  "phoneNumber": 9011111118,
  "address": "No 5A Road Nsukka",
  "category": "Fast food",
  "images": [],
  "user": "647e28234d7cd185e40d05a5",
  "menu": [],
  "_id": "64860a63ff80696fec1cd9f2",
  "createdAt": "2023-06-11T17:54:43.259Z",
  "updatedAt": "2023-06-11T17:54:43.259Z",
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
});
