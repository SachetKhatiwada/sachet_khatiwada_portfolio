// src/models/BlogPost.js - Blog post model

import mongoose ,{Schema,Document} from "mongoose";

export interface BlogPost extends Document{
  title :string;
  slug :string;
  excerpt :string;
  content :string;
  category: string;
  coverImage :string;
  tags :string[];
  published :boolean;
  createdAt :Date;
  updatedAt :Date;
}


const BlogPostSchema: Schema<BlogPost> = new Schema({
  title: {
    type: String,
    required: [true, 'Please provide a blog post title'],
    trim: true,
  },
  slug: {
    type: String,
    required: [true, 'Please provide a blog post slug'],
    unique: true,
    trim: true,
  },
  excerpt: {
    type: String,
    required: [true, 'Please provide a blog post excerpt'],
  },
  content: {
    type: String,
    required: [true, 'Please provide blog post content'],
  },
  coverImage: {
    type: String,
    required: [true, 'Please provide a cover image'],
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
  },
  tags: [String],
  published: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const BlogPostModel = (mongoose.models.BlogPost as mongoose.Model<BlogPost>) || mongoose.model<BlogPost>('BlogPost', BlogPostSchema);

export default BlogPostModel;