import React, { useEffect } from 'react';
import Screen from '../misc_components/Screen';
import { ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setStateToLoggedIn, setStateToLoggedOut, setStateToEmailNotVerified } from '../store/slices/authSlice';
import { displayDarkTheme } from '../store/slices/themeSlice';
import { setOnAuthStateChanged, setOnUserEmailVerifiedChanged } from '../api/auth';
import { getDarkTheme } from '../api/rtdb';

export default function MainScreen() {
    const dispatch = useDispatch();
    const accountDeleted = useSelector((state) => state.auth.accountDeleted);
    const theme = useSelector((state) => state.theme.darkTheme);

    useEffect(() => {
        return setOnAuthStateChanged(
            // onUserAuthenticated callback function
            (user) => {
                getDarkTheme(user.uid, 
                    (settings) => {
                        dispatch(displayDarkTheme(settings ? settings.darkTheme : false));
                    }, 
                    console.error
                );
                setOnUserEmailVerifiedChanged(
                    () => {
                        dispatch(setStateToLoggedIn({ displayName: user.displayName, email: user.email, userId: user.uid }));
                    },
                    () => {
                        dispatch(setStateToEmailNotVerified());
                    }
                )
                
            },
            // onUserNotFound callback function
            () => {
                dispatch(displayDarkTheme(false))
                dispatch(setStateToLoggedOut());
            }
        );
    }, []);

    return (
        <Screen screenStyle={{justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size="large" />
        </Screen>
    );
}