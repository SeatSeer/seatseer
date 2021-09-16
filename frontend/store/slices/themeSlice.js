import { createSlice } from '@reduxjs/toolkit';
import { setDarkTheme } from '../../api/rtdb';

export const themeSlice = createSlice({
    name: 'theme',
    initialState: {
        darkTheme: false
    },
    reducers: {
        toggleDarkTheme: (state, action) => {
            // payload will contain the current userId
            setDarkTheme(action.payload, !state.darkTheme, () => {}, () => {});
            state.darkTheme = !state.darkTheme;
        },
        displayDarkTheme: (state, action) => {
            // payload will contain the current setting for dark theme in firebase
            state.darkTheme = action.payload;
        }
    }
});

export const { toggleDarkTheme, displayDarkTheme } = themeSlice.actions;

export default themeSlice.reducer;