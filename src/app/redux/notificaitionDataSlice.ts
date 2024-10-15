// store/notificationSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the NotificationData interface
interface NotificationData {
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
// Define the initial state, which is an array of notifications
interface NotiticationState {
  notifications: NotificationData[];
}

const initialState: NotiticationState = {
  notifications: [],
};

export const notificationSlice = createSlice({
  name: 'notificationData',
  initialState,
  reducers: {
    // Action to set notifications
    setnotifications: (state, action: PayloadAction<NotificationData[]>) => {
      state.notifications = action.payload;
    },

    // Action to add a single notification
    addnotification: (state, action: PayloadAction<NotificationData>) => {
      state.notifications.push(action.payload);
    },

    // Action to update a notification
    updatenotification: (state, action: PayloadAction<NotificationData>) => {
      const index = state.notifications.findIndex(
        (notification) => notification._id === action.payload._id
      );
      if (index !== -1) {
        state.notifications[index] = action.payload;
      }
    },

    // Action to remove a notification by ID
    removenotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (notification) => notification._id !== action.payload
      );
    },
  },
});

// Export actions
export const {
  setnotifications,
  addnotification,
  updatenotification,
  removenotification,
} = notificationSlice.actions;

// Export reducer
export default notificationSlice.reducer;
