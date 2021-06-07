import { createSlice } from '@reduxjs/toolkit';

export const themeSlice = createSlice({
    name: 'theme',
    initialState: {
        darkTheme: false
    },
    reducers: {
        toggleDarkTheme: (state, action) => {
            state.darkTheme = !state.darkTheme;
        }
    }
});

export const { toggleDarkTheme } = themeSlice.actions;

export default themeSlice.reducer;