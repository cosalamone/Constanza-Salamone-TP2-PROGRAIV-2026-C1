import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import {Types} from "mongoose";


@Schema()
export class User {
    @Prop({ required: true })
    name!: string;
    @Prop({ required: true })
    lastName!: string;
    @Prop({ required: true })
    email!: string;
    @Prop({ required: true })
    password!: string;
    // @Prop({ required: true })
    // birthDate!: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
