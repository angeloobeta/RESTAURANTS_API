import { Module } from '@nestjs/common';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MenuSchema } from './schema/menu.schema';
import { AuthModule } from '../auth/auth.module';
import { RestaurantsModule } from '../restaurants/restaurants.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: 'Menu', schema: MenuSchema }]),
    RestaurantsModule,
  ],
  controllers: [MenuController],
  providers: [MenuService],
  // exports: [MongooseModule],
})
export class MenuModule {}
