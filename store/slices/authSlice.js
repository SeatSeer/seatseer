import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false,
        currentUserDisplayName: "",
        currentUserEmail: "",
        isEmailVerified: false,
        isLoading: true
    },
    reducers: {
        setStateToLoggedIn: (state, action) => {
            state.isLoggedIn = true;
            state.currentUserDisplayName = action.payload.displayName;
            state.currentUserEmail = action.payload.email;
            state.isEmailVerified = true;
            state.isLoading = false;
        },
        setStateToLoggedOut: (state) => {
            state.isLoggedIn = false;
            state.currentUserDisplayName = "";
            state.currentUserEmail = "";
            state.isEmailVerified = false;
            state.isLoading = false;
        },
        setStateToIsLoading: (state) => {
            state.isLoading = true;
        },
        setStateToEmailNotVerified: (state) => {
            state.isLoading = false;
            state.isLoggedIn = true;
            state.currentUserDisplayName = "";
            state.currentUserEmail = "";
            state.isEmailVerified = false;
        }
    }
});

export const { setStateToLoggedIn, setStateToLoggedOut, setStateToIsLoading, setStateToEmailNotVerified } = authSlice.actions;

export default authSlice.reducer;