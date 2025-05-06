// src/models/Project.js - Project model

import mongoose ,{Schema,Document} from "mongoose";

export interface Project extends Document{
  title :string;
  slug :string;
  description :string;
  content :string;
  technologies: string[]
  image :string;
  gallery :string[];
  demoUrl :string;
  githubUrl :string;
  featured :boolean;
  createdAt :Date;
}

const ProjectSchema: Schema<Project> = new Schema({
  title: {
    type: String,
    required: [true, 'Please provide a project title'],
    trim: true,
  },
  slug: {
    type: String,
    required: [true, 'Please provide a project slug'],
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a project description'],
  },
  content: {
    type: String,
    required: [true, 'Please provide project content'],
  },
  technologies: [String],
  image: {
    type: String,
    required: [true, 'Please provide a project image'],
  },
  gallery: [String], // Additional project images
  demoUrl: String,
  githubUrl: String,
  featured: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ProjectModel = (mongoose.models.Project as mongoose.Model<Project>) || mongoose.model<Project>("Project", ProjectSchema);

export default ProjectModel;