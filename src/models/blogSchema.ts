import mongoose, { Schema } from 'mongoose';
import { Types } from 'mongoose';

export interface Blog extends Document {
 title: string;
 description: string;
 coverImage: string;
 comments: Types.ObjectId[];
 likes: Types.ObjectId[]; 
}

const BlogSchema: Schema = new mongoose.Schema(
 {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
    },
 },
 { timestamps: true }
);

export default mongoose.model<Blog>('Blog', BlogSchema);
