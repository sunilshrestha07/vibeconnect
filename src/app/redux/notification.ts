// redux/authSlice.ts
import { createSlice } from '@reduxjs/toolkit';

const notiticationSlice = createSlice({
  name: 'notification',
  initialState: {
    isNotificationActive: false,
    isSearchActive: false,
  },
  reducers: {
    setNotificationActive: (state) => {
      state.isNotificationActive = true;
    },
    setNotificationNotActive: (state) => {
      state.isNotificationActive = false;
    },
    setSearchActive: (state) => {
      state.isSearchActive = true;
    },
    setSearchNotActive: (state) => {
      state.isSearchActive = false;
    },
  },
});

export const { setNotificationActive, setNotificationNotActive ,setSearchActive,setSearchNotActive} = notiticationSlice.actions;
export default notiticationSlice.reducer;
