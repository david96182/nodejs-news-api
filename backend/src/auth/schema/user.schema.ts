import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type UserDoc = User & Document;

@Schema()
export class User {
    @Prop({unique: true})
    username: string;

    @Prop()
    password: string;
    
}

export const UserSchema = SchemaFactory.createForClass(User);