import React, { useState } from 'react';
import { Alert, Button, Text, StyleSheet, View } from 'react-native';
import { logOut } from '../../../api/auth';
import { useTheme } from '@react-navigation/native';
import { setOnPasswordReset } from '../../../api/auth';
import { setStateToIsLoading } from '../../../store/slices/authSlice';
import { useDispatch, useSelector} from 'react-redux';

export default function Account() {
    const { colors } = useTheme();
    const currentUserEmail = useSelector((state) => state.auth.currentUserEmail);
    const [isPasswordResetEmailSent, setIsPasswordResetEmailSent] = useState(false);

    const dispatch = useDispatch();

    function handleResetPassword() {
        setOnPasswordReset(
            currentUserEmail,
            // onSuccessfulResetPasswordEmailSent callback function
            () => {
                Alert.alert(
                    "Reset Password",
                    `An email has been sent to ${currentUserEmail} for you to reset your password`,
                    [{
                        text: "OK"
                    }],
                    { cancelable: true }
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
            () => dispatch(setStateToIsLoading()),
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