import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RestuarantsController } from './restuarants/restuarants.controller';
import { RestuarantsModule } from './restuarants/restuarants.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URL_LOCAL),
    RestuarantsModule,
  ],
  controllers: [AppController, RestuarantsController],
  providers: [AppService],
})
export class AppModule {}
