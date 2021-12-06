import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogModule } from './blog/blog.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
  MongooseModule.forRoot('mongodb://mongodb:27017/newsdb'),
  BlogModule,
  ScheduleModule.forRoot(),
  AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
