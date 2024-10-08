// store/storySlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the StoryData interface
interface StoryData {
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
  }[];
}

// Define the initial state, which is an array of StoryData
interface StoryState {
  stories: StoryData[];
}

const initialState: StoryState = {
  stories: [],
};

export const storySlice = createSlice({
  name: 'stories',
  initialState,
  reducers: {
    // Action to set stories
    setStories: (state, action: PayloadAction<StoryData[]>) => {
      state.stories = action.payload;
    },

    // Action to add a single story
    addStory: (state, action: PayloadAction<StoryData>) => {
      state.stories.push(action.payload);
    },

    // Action to update a story
    updateStory: (state, action: PayloadAction<StoryData>) => {
      const index = state.stories.findIndex(
        (story) => story._id === action.payload._id
      );
      if (index !== -1) {
        state.stories[index] = action.payload;
      }
    },

    // Action to remove a story by ID
    removeStory: (state, action: PayloadAction<string>) => {
      state.stories = state.stories.filter(
        (story) => story._id !== action.payload
      );
    },
  },
});

// Export actions
export const { setStories, addStory, updateStory, removeStory } = storySlice.actions;

// Export reducer
export default storySlice.reducer;
