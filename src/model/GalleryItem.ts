// src/models/GalleryItem.js - Gallery item model

import mongoose ,{Schema,Document} from "mongoose";

export interface GalleryItem extends Document{
  title :string;
  description :string;
  imageUrl :string;
  category :string;
  featured :boolean;
  createdAt :Date;
}

const GalleryItemSchema: Schema<GalleryItem> = new Schema({
  title: {
    type: String,
    required: [true, 'Please provide an image title'],
    trim: true,
  },
  description: String,
  imageUrl: {
    type: String,
    required: [true, 'Please provide an image URL'],
  },
  category: String,
  featured: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const GalleryItemModel = (mongoose.models.GalleryItem as mongoose.Model<GalleryItem>) || mongoose.model<GalleryItem>('GalleryItem', GalleryItemSchema);

export default GalleryItemModel;