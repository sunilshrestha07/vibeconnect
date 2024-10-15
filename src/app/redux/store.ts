import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import userReducer from './UserSlice'
import authReducer from './authSlice'
import storyReducer from './storySlice'
import postReducer from './postSlice'
import commentReducer from './commentSlice'
import notificationReducer from './notification'

// Combine your reducers into a root reducer
const rootReducer = combineReducers({
    user: userReducer,
    auth:authReducer,
    stories:storyReducer,
    posts: postReducer,
    comments: commentReducer,
    notification:notificationReducer
});

// Configuration for Redux Persist
const persistConfig = {
    key: 'root',
    storage,
    version: 1,
};

// Create a persisted reducer using the root reducer and persist configuration
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the Redux store
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }),
});

// Create the Redux Persistor (for persisting the Redux store)
export const persistor = persistStore(store);

// Define TypeScript types for easier usage throughout the application
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type RootStateType = RootState;