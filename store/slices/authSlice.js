import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false,
        currentUserDisplayName: "",
        currentUserEmail: "",
        isEmailVerified: false,
        isLoading: true,
        accountDeleted: false
    },
    reducers: {
        setStateToLoggedIn: (state, action) => {
            state.isLoggedIn = true;
            state.currentUserDisplayName = action.payload.displayName;
            state.currentUserEmail = action.payload.email;
            state.isEmailVerified = true;
            state.isLoading = false;
            state.accountDeleted = false;
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
            state.accountDeleted = false;
        },
        changeCurrentUserEmail: (state, action) => {
            state.currentUserEmail = action.payload;
            state.isEmailVerified = false;
            state.accountDeleted = false;
        },
        loadAccountDeleted: (state) => {
            state.isLoading = true,
            state.isLoggedIn = false;
            state.isEmailVerified = false;
            state.currentUserDisplayName = "";
            state.currentUserEmail = "";
            state.accountDeleted = true;
        },
        setAccountDeleted: (state) => {
            state.isLoading = false,
            state.isLoggedIn = false;
            state.isEmailVerified = false;
            state.currentUserDisplayName = "";
            state.currentUserEmail = "";
            state.accountDeleted = true;
        },
        loadAuthStack: (state) => {
            state.isLoading = true;
            state.accountDeleted = false;
        }
    }
});

export const {
    setStateToLoggedIn,
    setStateToLoggedOut,
    setStateToIsLoading,
    setStateToEmailNotVerified,
    changeCurrentUserEmail,
    loadAccountDeleted,
    setAccountDeleted,
    loadAuthStack
} = authSlice.actions;

export default authSlice.reducer;