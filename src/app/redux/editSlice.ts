// redux/authSlice.ts
import { createSlice } from '@reduxjs/toolkit';

const editSlice = createSlice({
  name: 'edit',
  initialState: {
    isEditActive: false,
  },
  reducers: {
    setIsEditActive: (state) => {
      state.isEditActive = true;
    },
    setIsEditNotActive: (state) => {
      state.isEditActive = false;
    },
  },
});

export const { setIsEditActive, setIsEditNotActive } = editSlice.actions;
export default editSlice.reducer;
