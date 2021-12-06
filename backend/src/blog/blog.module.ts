import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { Blog, BlogSchema } from './schema/blog.schema';
import { AuthModule } from '../auth/auth.module';
import { DeletedBlog, DeletedBlogSchema } from './schema/deleted-blogs.schema';

@Module({
  controllers: [BlogController],
  providers: [BlogService],
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema },
    {name: DeletedBlog.name, schema: DeletedBlogSchema}]),
    AuthModule
  ],
})
export class BlogModule {}
