import { 
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Query,
    UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BlogService } from './blog.service';
import { GetBlogsFilterDto } from './dto/get-blogs-filter.dto';
import { DeletedBlog } from './schema/deleted-blogs.schema';
import FindOneParams from './findParams';


@Controller('blog')
@UseGuards(AuthGuard())
export class BlogController {
    constructor(private readonly blogservice: BlogService) {}

    @Get()
    async getBlogs(@Query() getBlogsFilterDto: GetBlogsFilterDto) {
        return await this.blogservice.findAll(getBlogsFilterDto);
    }

    @Delete('/:id')
    async deleteBlog(
        @Param() {id}: FindOneParams): Promise<DeletedBlog> {
            return await this.blogservice.deleteBlog(id);
        } 
}
