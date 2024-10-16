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
  likes: string[]; // Array of ObjectId references to User (for likes)
  comments: string[]; // Array of ObjectId references to User (for comments)
  user: {
    _id: string;
    userName: string;
    avatar: string;
  }; // Owner of the post (reference to User)
  createdAt: Date; // Timestamp for when the post was created
  updatedAt: Date; // Timestamp for when the post was last updated
}

export interface LoginInterface {
  email: string;
  password: string;
}

export interface SignUpInterface {
  email: string;
  userName: string;
  password: string;
}

export interface VerifyInterface {
  email: string;
  verificationCode: string;
}
export interface NotificationInterface {
  _id: string;
  notificationFor: {
    _id: string;
    userName: string;
    avatar: string;
  };
  notificationFrom: {
    _id: string;
    userName: string;
    avatar: string;
  };
  post?: {
    _id: string;
    media: {
      url: string;
      type: string;
    };
  };
  notificationType: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface User {
  _id: string;
  userName: string;
  avatar: string;
  email: string;
  followers?: {
    _id: string;
    userName: string;
    avatar: string;
  }[];
  following?: {
    _id: string;
    userName: string;
    avatar: string;
  }[];
  bio: string;
}


export interface SingleUser {
  _id: string;
  userName: string;
  avatar: string;
  email: string;
  followers?: string[]
  following?: string[]
  bio: string;
}



