// src/models/Contact.js - Contact message model


import mongoose ,{Schema,Document} from "mongoose";

export interface Contact extends Document{
  name :string;
  email :string;
  subject :string;
  message :string;
  read :boolean;
  createdAt :Date;
}


const ContactSchema: Schema<Contact> = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    trim: true,
  },
  subject: {
    type: String,
    required: [true, 'Please provide a subject'],
    trim: true,
  },
  message: {
    type: String,
    required: [true, 'Please provide a message'],
  },
  read: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ContactModel = (mongoose.models.Contact as mongoose.Model<Contact>) || mongoose.model<Contact>('Contact', ContactSchema);

export default ContactModel;
