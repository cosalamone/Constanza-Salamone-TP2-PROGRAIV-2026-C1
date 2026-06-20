import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Publication {
  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  description!: string;

  @Prop({ required: false })
  imageUrl?: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId!: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  likes!: Types.ObjectId[];

  @Prop({
    type: [
      {
        text: { type: String, required: true },
        user: { type: Types.ObjectId, ref: 'User', required: true },
        createdAt: { type: Date, default: Date.now },
        modified: { type: Boolean, default: false },
      },
    ],
    default: [],
  })
  comments!: Array<{
    text: string;
    user: Types.ObjectId;
    createdAt: Date;
    modified: boolean;
  }>;

  @Prop({ default: false })
  _deleted!: boolean;
}

export const PublicationSchema = SchemaFactory.createForClass(Publication);
