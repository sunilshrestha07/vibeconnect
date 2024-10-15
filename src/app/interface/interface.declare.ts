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
  _id: string;
  discription?: string;
  media: {
    url: string;
    type: string;
  };
  likes: ObjectId[];
  comments: ObjectId[];
  user: {
    _id: string;
    userName: string;
    avatar: string;
  };
  createdAt: Date;
  updatedAt: Date;
  followers?: ObjectId[];
  following?: ObjectId[];
  bio: string;
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
