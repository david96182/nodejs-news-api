import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type DeletedBlogDoc = DeletedBlog & Document;

@Schema()
export class DeletedBlog {
    @Prop()
    object_id: number;

    @Prop()
    title: string;

}

export const DeletedBlogSchema = SchemaFactory.createForClass(DeletedBlog);