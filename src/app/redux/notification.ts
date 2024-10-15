// redux/authSlice.ts
import { createSlice } from '@reduxjs/toolkit';

const notiticationSlice = createSlice({
  name: 'notification',
  initialState: {
    isNotificationActive: false,
  },
  reducers: {
    setNotificationActive: (state) => {
      state.isNotificationActive = true;
    },
    setNotificationNotActive: (state) => {
      state.isNotificationActive = false;
    },
  },
});

export const { setNotificationActive, setNotificationNotActive } = notiticationSlice.actions;
export default notiticationSlice.reducer;
