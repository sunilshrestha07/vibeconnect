import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the PostData interface
export interface PostData {
  _id: string; // ID for the post
  description?: string; // Optional description
  media: {
    url: string;
    type: string;
  }; // Media (URL and type)
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

// Define the initial state, which is an array of PostData
interface PostState {
  posts: PostData[];
}

const initialState: PostState = {
  posts: [], // Ensuring it's initialized as an array
};

export const savedSlice = createSlice({
  name: 'saved',
  initialState,
  reducers: {
    // Action to set posts
    setSaved: (state, action: PayloadAction<PostData[]>) => {
      // Safety check to ensure payload is an array
      if (Array.isArray(action.payload)) {
        state.posts = action.payload;
      } else {
        console.error("setSaved: Payload is not an array");
      }
    },

    // Action to add a single post
    addSaved: (state, action: PayloadAction<PostData>) => {
      // Ensure state.posts is always an array before using array methods
      if (!Array.isArray(state.posts)) {
        console.error("addSaved: state.posts is not an array");
        state.posts = [];
      }

      // Check if post already exists (avoid duplicates)
      const existingPostIndex = state.posts.findIndex(
        (post) => post._id === action.payload._id
      );
      
      if (existingPostIndex !== -1) {
        // If the post already exists, remove it (to allow re-adding)
        state.posts.splice(existingPostIndex, 1);
      }

      // Add the new post
      state.posts.push(action.payload);
    },

    // Action to update a post
    updateSaved: (state, action: PayloadAction<PostData>) => {
      if (!Array.isArray(state.posts)) {
        console.error("updateSaved: state.posts is not an array");
        state.posts = [];
      }

      const index = state.posts.findIndex(
        (post) => post._id === action.payload._id
      );
      if (index !== -1) {
        state.posts[index] = action.payload;
      }
    },

    // Action to remove a post by ID
    removeSaved: (state, action: PayloadAction<string>) => {
        state.posts = state.posts.filter(
          (post) => post._id !== action.payload
        );
      },
  },
});

// Export actions
export const { setSaved, addSaved, updateSaved, removeSaved } = savedSlice.actions;

// Export reducer
export default savedSlice.reducer;
