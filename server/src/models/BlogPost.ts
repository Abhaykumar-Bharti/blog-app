import { Schema, model, Document } from 'mongoose';

export interface IBlogPost extends Document {
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  authorId: Schema.Types.ObjectId;
  authorName: string;
  published: boolean;
  summary?: string | null;
  tags?: string[];
  likes: number;
  likedBy: Schema.Types.ObjectId[];
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      default: '',
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    authorName: {
      type: String,
      required: true,
    },
    published: {
      type: Boolean,
      default: false,
    },
    summary: {
      type: String,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
    },
    likes: {
      type: Number,
      default: 0,
    },
    likedBy: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Map _id to id in JSON output
BlogPostSchema.set('toJSON', {
  transform: (doc, ret: any) => {
    ret.id = ret._id.toString();
    ret.authorId = ret.authorId.toString();
    if (ret.likedBy) {
      ret.likedBy = ret.likedBy.map((id: any) => id.toString());
    }
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const BlogPost = model<IBlogPost>('BlogPost', BlogPostSchema);
