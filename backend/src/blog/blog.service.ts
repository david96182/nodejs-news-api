import { Injectable, Logger, ParseArrayPipe, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import { Model } from 'mongoose';
import { CreateBlogDto } from './dto/create-blog.dto';
import { Blog, BlogDoc } from './schema/blog.schema';
import { GetBlogsFilterDto } from './dto/get-blogs-filter.dto';
import { DeletedBlog, DeletedBlogDoc } from './schema/deleted-blogs.schema';

@Injectable()
export class BlogService {
  private logger = new Logger('BlogService');
  constructor(@InjectModel(Blog.name) private readonly blog_model: Model<BlogDoc>,
  @InjectModel(DeletedBlog.name) private readonly deletedblog_model: Model<DeletedBlogDoc>) { }

  async findAll(getBlogsFilterDto: GetBlogsFilterDto) {
    const { author, title, tag, month, skip: documentsToSkip = 0, limit: limitOfDocuments = 5 } = getBlogsFilterDto;

    const query = this.blog_model
      .find()
      .sort({ createdAt: 'desc' })
      .select('-__v')
      .skip(documentsToSkip)

    if (author) {
      query.find({ author: author });
    }

    if (title) {
      query.find({ title: title });
    }

    if (tag) {
      query.find({ _tags: { $all: [tag] } });
    }
    
    if (month) {
      const date = new Date();
      const monthstr = month + '';
      switch (monthstr) {
        case 'january':
          date.setMonth(0);
          break;
        case 'february':
          date.setMonth(1);
          break;
        case 'march':
          date.setMonth(2);
          break;
        case 'april':
          date.setMonth(3);
          break;
        case 'may':
          date.setMonth(4);
          break;
        case 'june':
          date.setMonth(5);
          break;
        case 'july':
          date.setMonth(6);
          break;
        case 'august':
          date.setMonth(7);
          break;
        case 'september':
          date.setMonth(8);
          break;
        case 'october':
          date.setMonth(9);
          break;
        case 'november':
          date.setMonth(10);
          break;
        case 'december':
          date.setMonth(11);
          break;
        default:
          break;
      }
      
      query.find({
            $expr: {
              $eq: [{ $month: '$createdAt' }, { $month: date }],
            },
          }
      )
    }

    query.limit(limitOfDocuments);
    const blogs = await query;
    const count = await this.blog_model.count();
    
    return { blogs, count};
  }

  async createBlog(createBlogDto: CreateBlogDto) {
    return new this.blog_model({
      ...createBlogDto
    }).save((err, data) => {
      if (data) {
        return data
      }
    });
  }

  async deleteBlog(id: string): Promise<DeletedBlog> {
    const blog = await this.blog_model.findOne({ _id: id });
    if (blog) {
    try {
      const deletedblog = new this.deletedblog_model({object_id: blog.object_id, title: blog.title});

      await deletedblog.save();
      await blog.delete();

      return deletedblog;
    } catch (error) {
      this.logger.error(`Failed to delete blog with id ${id}`,error.stack);
      throw new InternalServerErrorException();
    }
  }
  else {
    this.logger.error(`There is no blog with id ${id}`);
    throw new NotFoundException();
    }
  }


  @Cron('0 0 * * * *')
  async requestHackerNews() {
    this.logger.log('Fetching news from Hacker News');
    await axios.get('http://hn.algolia.com/api/v1/search_by_date?query=nodejs').then(
      (response) => {
        response.data.hits.forEach(async (element) => {
          if (! await this.blog_model.findOne({ object_id: element['objectID'] }) && 
           ! await this.deletedblog_model.findOne({ object_id: element['objectID'] })) {
            if (!element['title'] || !element['story_title']) {
              await this.createBlog(<CreateBlogDto>{
                object_id: element['objectID'],
                title: !element['title'] ? element['story_title'] : element['title'],
                url: !element['url'] ? element['story_url'] : element['url'],
                author: element['author'],
                createdAt: element['created_at'],
                _tags: element['_tags']
              }
              )
            }
          }
        });
      }
    ).catch(err => this.logger.error(`Error fetching news: ${err}`))
  }
}
