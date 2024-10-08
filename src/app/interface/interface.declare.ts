import { ObjectId } from 'mongoose';

export interface StoryData {
  _id: string;
  user: {
    _id: string;
    userName: string;
    avatar: string;
  };
  media: {
    url: string;
    type: string;
  };
  isActive: boolean;
  viewers: {
    _id: string;
  };
}


export interface Post {
    _id: string; // ID for the post
    discription?: string; // Optional description
    media: {
      url: string;
      type: string;
    }; // Array of image URLs
    likes: ObjectId[]; // Array of ObjectId references to User (for likes)
    comments: ObjectId[]; // Array of ObjectId references to User (for comments)
    user: {
      _id: string;
      userName: string;
      avatar: string;
    }; // Owner of the post (reference to User)
    createdAt: Date; // Timestamp for when the post was created
    updatedAt: Date; // Timestamp for when the post was last updated
  }