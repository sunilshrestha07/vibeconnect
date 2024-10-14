// store/storySlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the StoryData interface
export interface CommentData {
    _id: string; 
    comment: string; 
    user: {
      _id: string;
      userName: string;
      avatar: string;
    }; 
    post: string;
    createdAt: Date; 
    updatedAt: Date; 
  }

// Define the initial state, which is an array of StoryData
interface CommentState {
  comments: CommentData[];
}

const initialState: CommentState = {
    comments: [],
};

export const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    // Action to set stories
    setComments: (state, action: PayloadAction<CommentData[]>) => {
      state.comments = action.payload;
    },

    // Action to add a single story
    addComments: (state, action: PayloadAction<CommentData>) => {
      state.comments.push(action.payload);
    },

    // Action to update a story
    updateComments: (state, action: PayloadAction<CommentData>) => {
      const index = state.comments.findIndex(
        (comment) => comment._id === action.payload._id
      );
      if (index !== -1) {
        state.comments[index] = action.payload;
      }
    },

    // Action to remove a story by ID
    removeComments: (state, action: PayloadAction<string>) => {
      state.comments = state.comments.filter(
        (comment) => comment._id !== action.payload
      );
    },
  },
});

// Export actions
export const {setComments, addComments, updateComments, removeComments} = commentSlice.actions;

// Export reducer
export default commentSlice.reducer;
