import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type BlogDoc = Blog & Document;

@Schema()
export class Blog {
    @Prop({unique: true})
    object_id: number;

    @Prop()
    title: string;

    @Prop()
    url: string;

    @Prop()
    createdAt: Date;

    @Prop()
    author: string;

    @Prop()
    _tags: [string]
}

export const BlogSchema = SchemaFactory.createForClass(Blog);