import { Schema, model, Document } from 'mongoose';

export interface IComment extends Document {
  blogId: Schema.Types.ObjectId;
  authorId: Schema.Types.ObjectId;
  authorName: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    blogId: {
      type: Schema.Types.ObjectId,
      ref: 'BlogPost',
      required: true,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    authorName: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Map _id to id in JSON output
CommentSchema.set('toJSON', {
  transform: (doc, ret: any) => {
    ret.id = ret._id.toString();
    ret.blogId = ret.blogId.toString();
    ret.authorId = ret.authorId.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Comment = model<IComment>('Comment', CommentSchema);
