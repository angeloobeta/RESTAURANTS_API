import { Module } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { RestaurantsController } from './restauarants.controller';
import { RestaurantSchema } from './schemas/restaurants.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Restaurant',
        schema: RestaurantSchema,
      },
    ]),
  ],
  providers: [RestaurantsService],
  controllers: [RestaurantsController],
})
export class RestaurantsModule {}
