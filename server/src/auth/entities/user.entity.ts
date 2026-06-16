import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User {
    @Prop({ required: true })
    name!: string;

    @Prop({ required: true })
    lastName!: string;

    @Prop({ required: true, unique: true })
    username!: string;

    @Prop({ required: true })
    password!: string;

    @Prop({ required: true })
    birthDate!: Date;

    @Prop({ required: false })
    description?: string;

    @Prop({ required: false })
    profileImage?: string;

    @Prop({ required: true, default: 'usuario' })
    role!: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
