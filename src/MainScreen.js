import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { setStateToLoggedIn, setStateToLoggedOut, setStateToEmailNotVerified } from '../store/slices/authSlice';
import { setOnAuthStateChanged, setOnUserEmailVerifiedChanged } from '../api/auth';

export default function MainScreen() {
    const dispatch = useDispatch();

    useEffect(() => {
        setOnAuthStateChanged(
            // onUserAuthenticated callback function
            (user) => {
                setOnUserEmailVerifiedChanged(
                    () => {
                        dispatch(setStateToLoggedIn({ displayName: user.displayName, email: user.email }));
                    },
                    () => {
                        dispatch(setStateToEmailNotVerified());
                    }
                )
                
            },
            // onUserNotFound callback function
            () => {
                dispatch(setStateToLoggedOut());
            }
        );
    });

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10
    }
})