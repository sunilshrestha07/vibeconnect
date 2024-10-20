import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import userReducer from './UserSlice'
import editReducer from './editSlice'
import storyReducer from './storySlice'
import postReducer from './postSlice'
import commentReducer from './commentSlice'
import notificationReducer from './notification'
import notificationDataReducer from './notificaitionDataSlice'
import savedReducer from './savedSlice'

// Combine your reducers into a root reducer
const rootReducer = combineReducers({
    user: userReducer,
    edit:editReducer,
    stories:storyReducer,
    posts: postReducer,
    comments: commentReducer,
    notification:notificationReducer,
    notificationData:notificationDataReducer,
    saved: savedReducer
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