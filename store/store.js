import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import themeReducer from './slices/themeSlice';
import notificationsReducer from './slices/notificationsSlice';

export default configureStore({
    reducer: {
        auth: authReducer,
        theme: themeReducer,
        notifications: notificationsReducer
    }
})