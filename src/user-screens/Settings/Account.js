import React, { useState } from 'react';
import { Alert, Button, Text, StyleSheet, View } from 'react-native';
import { CommonActions } from "@react-navigation/native";
import { logOut } from '../../../api/auth';
import { useTheme } from '@react-navigation/native';
import { setOnPasswordReset } from '../../../api/auth';

export default function Account({ route, navigation }) {
    const { colors } = useTheme();
    const { email } = route.params;
    const [isPasswordResetEmailSent, setIsPasswordResetEmailSent] = useState(false);

    function handleResetPassword() {
        setOnPasswordReset(
            email,
            // onSuccessfulResetPasswordEmailSent callback function
            () => {
                Alert.alert(
                    "Reset Password",
                    `An email has been sent to ${email} for you to reset your password`,
                    {
                        text: "OK"
                    }
                )
                setIsPasswordResetEmailSent(true);
            },
            // onPasswordEmailFailedToSend callback function
            (error) => {
                console.error(error);
            }
        )
    }

    function handleLogout() {
        logOut(
            // onSuccess callback function
            () => {
                navigation.dispatch(CommonActions.reset({
                    index: 0,
                    routes: [{ name: "MainScreen" }]
                }))
            },
            // onError callback function
            console.error
        );
    }

    return (
      <View style={[styles.container, { background: colors.background }]}>
        <Text style ={{color : colors.text}}>Account Management</Text>
            <Button title={"Reset password"} onPress={handleResetPassword} color="#3493f9" />
        <Button title={"Log out"} onPress={handleLogout} color="#3493f9" />
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10
    },

    information_text: {
        fontSize: 17,
        textAlign: "center"
    },
})