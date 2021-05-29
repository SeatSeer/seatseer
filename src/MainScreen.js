import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { setOnAuthStateChanged } from '../api/auth'

export default function MainScreen({ navigation }) {
    useEffect(() => {
        setOnAuthStateChanged(
            // onUserAuthenticated callback function
            (user) => {
                if (user.emailVerified) {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: "MainTabs" }]
                    })
                } else {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: "VerifyEmail" }]
                    })
                }
            },
            // onUserNotFound callback function
            () => navigation.reset({
                index: 0,
                routes: [{ name: "Login" }]
            })
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