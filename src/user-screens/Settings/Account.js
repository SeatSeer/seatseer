import React, { useState } from 'react';
import { Alert, Button } from 'react-native';
import Screen from '../../../misc_components/Screen';
import CustomText from '../../../misc_components/CustomText';
import { logOut } from '../../../api/auth';
import { setOnPasswordReset } from '../../../api/auth';
import { setStateToIsLoading } from '../../../store/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';

export default function Account() {
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
      <Screen>
          <CustomText text={"Account Managament"} />
          <Button title={"Reset password"} onPress={handleResetPassword} color="#3493f9" />
          <Button title={"Log out"} onPress={handleLogout} color="#3493f9" />
      </Screen>
    );
}