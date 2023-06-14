import { BadRequestException, NotFoundException } from "@nestjs/common";
import { RestaurantsService } from "../restaurants.service";
import { Model } from "mongoose";
import { Restaurant } from "./restaurants.schema";
import { getModelToken } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";


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

describe('updateById', () => {
  let model: Model<Restaurant>;
  let service: RestaurantsService;

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
  });
  // check if id exist
  it('should throw restaurant not found error', async () => {
    const mockError = new NotFoundException('Restaurant not found');
    jest.spyOn(model, 'findById').mockRejectedValue(mockError);
    await expect(service.findRestaurantById(mockRestaurant._id)).rejects.toThrow(
      NotFoundException,
    );
  });
  //update the restaurant
});



This is the error message that it keeps throwing, it would pass the test

""
it('should throw restaurant not found error', async () => {
}
  155 |       const mockError = new NotFoundException('Restaurant not found');
> 156 |       jest.spyOn(model, 'findById').mockRejectedValue(new NotFoundException('Restaurant not found'));
|                                                       ^
  157 |       await expect(service.findById(mockRestaurant._id)).rejects.toThrow(
    158 |         NotFoundException,
    159 |       );
  ""

