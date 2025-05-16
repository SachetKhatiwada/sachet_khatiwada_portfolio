// src/models/GalleryItem.js - Gallery item model

import mongoose ,{Schema,Document} from "mongoose";

export interface GalleryItem extends Document{
  title :string;
 imageUrl :string;
  caption :string;
  createdAt :Date;
}

const GalleryItemSchema: Schema<GalleryItem> = new Schema({
  title: {
    type: String,
    required: [true, 'Please provide an image title'],
    trim: true,
  },
  caption: String,
  imageUrl: {
    type: String,
    required: [true, 'Please provide an image URL'],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const GalleryItemModel = (mongoose.models.GalleryItem as mongoose.Model<GalleryItem>) || mongoose.model<GalleryItem>('GalleryItem', GalleryItemSchema);

export default GalleryItemModel;