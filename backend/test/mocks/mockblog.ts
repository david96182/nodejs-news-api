import { Blog } from "src/blog/schema/blog.schema";

export const mockBlog = (
    object_id = 12345678,
    title= 'title',
    url= 'www.url.com',
    createdAt= new Date(2021, 1, 1, 10, 33),
    author= 'author',
    _tags: [string]
  ) :Blog =>  ({
    object_id,
    title,
    url,
    createdAt, 
    author,
    _tags
  })