import { Module } from '@nestjs/common';
import { RestaurantsService } from './restauarants.service';
import { RestaurantsController } from './restauarants.controller';

@Module({
  providers: [RestaurantsService],
  controllers: [RestaurantsController],
})
export class RestuarantsModule {}
