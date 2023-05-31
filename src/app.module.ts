import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RestaurantsController } from './restauarants/restauarants.controller';
import { RestaurantsModule } from './restauarants/restauarants.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URL_LOCAL),
    RestaurantsModule,
  ],
  controllers: [AppController, RestaurantsController],
  providers: [AppService],
})
export class AppModule {}
