import { Module } from '@nestjs/common';
import { RestuarantsService } from './restuarants.service';
import { RestuarantsController } from './restuarants.controller';

@Module({
  providers: [RestuarantsService],
  controllers: [RestuarantsController],
})
export class RestuarantsModule {}
