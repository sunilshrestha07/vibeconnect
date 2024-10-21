// store/storySlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the StoryData interface
export interface PostData {
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

// Define the initial state, which is an array of StoryData
interface PostState {
  posts: PostData[];
  reels: PostData[];
}

const initialState: PostState = {
  posts: [],
  reels: [],
};

export const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    // Action to set stories
    setPosts: (state, action: PayloadAction<PostData[]>) => {
      state.posts = action.payload;
    },

    // action to set reels
    setReels: (state, action: PayloadAction<PostData[]>) => {
      state.reels = action.payload;
    },

    // Action to add a single story
    addPost: (state, action: PayloadAction<PostData>) => {
      state.posts.push(action.payload);
    },

    // add reel
    addReel: (state, action: PayloadAction<PostData>) => {
      state.reels.push(action.payload);
    },

    // Action to update a story
    updatePost: (state, action: PayloadAction<PostData>) => {
      const index = state.posts.findIndex(
        (post) => post._id === action.payload._id
      );
      if (index !== -1) {
        state.posts[index] = action.payload;
      }
    },
    // Action to update a reel
    updateReel: (state, action: PayloadAction<PostData>) => {
      const index = state.reels.findIndex(
        (reel) => reel._id === action.payload._id
      );
      if (index !== -1) {
        state.reels[index] = action.payload;
      }
    },

    // Action to remove a story by ID
    removePost: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter(
        (post) => post._id !== action.payload
      );
    },
    removeReel: (state, action: PayloadAction<string>) => {
      state.reels = state.reels.filter(
        (reel) => reel._id !== action.payload
      );
    },
  },
});

// Export actions
export const { setPosts, addPost, updatePost, removePost ,setReels, addReel, removeReel, updateReel} = postSlice.actions;

// Export reducer
export default postSlice.reducer;
