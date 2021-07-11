import React, { useEffect, useState, useRef } from 'react';
import { Alert, StyleSheet, Text, View, TextInput } from 'react-native';
import { Button } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DismissKeyboard from '../../../misc_components/DismissKeyboard';
import Screen from '../../../misc_components/Screen';
import CustomText from '../../../misc_components/CustomText';
import { useSelector, useDispatch } from 'react-redux';
import { setOnUserEmailChanged } from '../../../api/auth';
import { changeCurrentUserEmail } from '../../../store/slices/authSlice';

export default function UpdateEmail() {
    const currentUserEmail = useSelector((state) => state.auth.currentUserEmail);
    const dispatch = useDispatch();
    const [newEmail, setNewEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [emailFieldError, setEmailFieldError] = useState(null);
    const [passwordFieldError, setPasswordFieldError] = useState(null);
    const emailTextInput = useRef();
    const passwordTextInput = useRef();

    useEffect(() => {
        emailTextInput.current.focus();
    }, []);

    function handleUpdateEmail() {
        setEmailFieldError(null);
        setPasswordFieldError(null);
        if (newEmail === currentUserEmail) {
            Alert.alert(
                "Invalid email",
                'Please enter a different email.', 
                [{ text: "OK" }],
                { cancelable: true }
            );
            setEmailFieldError('Please enter a different email.');
        } else {
            setOnUserEmailChanged(
                currentUserEmail, password, newEmail,
                // onUserEmailChanged callback
                () => {
                    Alert.alert(
                        "Email updated",
                        'Your email was successfully updated. Please verify your account via the link sent to your new email to continue using SeatSeer.\nIf you did not want to change your email, we have sent a link to your previous email that can undo this action.', 
                        [{ text: "OK" }],
                        { cancelable: true }
                    );
                    dispatch(changeCurrentUserEmail(newEmail));
                },
                // onUserEmailFailedToChange
                (error) => {
                    let errorCode = error.code;
                    switch (errorCode) {
                        case 'auth/invalid-email': 
                            Alert.alert(
                                "Invalid email",
                                'Please enter a valid email.', 
                                [{ text: "OK" }],
                                { cancelable: true }
                            );
                            setEmailFieldError('Please enter a valid email.');
                            break;
                        case 'auth/email-already-in-use':
                            Alert.alert(
                                "Email already in use",
                                'The new email you have entered is already in use. Please enter an email that does not have a SeatSeer account.', 
                                [{ text: "OK" }],
                                { cancelable: true }
                            );
                            setEmailFieldError('Email already in use.');
                            break;
                        case 'auth/wrong-password':
                            Alert.alert(
                                "Invalid password",
                                'The password you have entered is wrong. Please enter the correct password to correctly identify yourself.', 
                                [{ text: "OK" }],
                                { cancelable: true }
                            );
                            setPasswordFieldError('Invalid password.')
                            break;
                        default: 
                            Alert.alert(
                                "Error",
                                'Oops, something went wrong!', 
                                [{ text: "OK" }],
                                { cancelable: true }
                            );
                    }
                }
            )
        }
    }

    return (
        <DismissKeyboard>
            <Screen screenStyle={styles.container}>
                <View style={{marginTop: 30, width: '80%', alignItems: 'center'}}>
                    <CustomText text={"Enter your new email:"} textStyle={{alignSelf: 'flex-start', fontSize: 12}} />
                    <View style={{...styles.email_input_view, borderWidth: emailFieldError ? 1 : 0, borderColor: 'red', marginBottom: emailFieldError ? 0 : 10}}>
                        <TextInput
                            ref={emailTextInput}
                            style={styles.email_text_input}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            returnKeyType="next"
                            placeholder="New Email"
                            placeholderTextColor="#003f5c"
                            onChangeText={setNewEmail}
                            onSubmitEditing={() => passwordTextInput.current.focus()}
                        />
                    </View>
                    {
                        emailFieldError
                            ? <Text style={{alignSelf: 'flex-start', color: 'red', fontSize: 10, marginBottom: 10}}>{emailFieldError}</Text>
                            : <></>
                    }

                    <CustomText text={"Enter your password (just to make sure it's you):"} textStyle={{alignSelf: 'flex-start', fontSize: 12}} />
                    <View style={{...styles.password_input_view, borderWidth: passwordFieldError ? 1 : 0, borderColor: 'red'}}>
                        <TextInput
                            ref={passwordTextInput}
                            style={styles.password_text_input}
                            autoCapitalize="none"
                            returnKeyType="go"
                            placeholder="Password"
                            placeholderTextColor="#003f5c"
                            secureTextEntry={!isPasswordVisible}
                            onChangeText={setPassword}
                            onSubmitEditing={handleUpdateEmail}
                        />
                        <Ionicons name={isPasswordVisible ? "eye-off" : "eye"} size={20} color="gray" onPress={() => setIsPasswordVisible(!isPasswordVisible)} style={{flex: 1}} />
                    </View>
                    {
                        passwordFieldError
                            ? <Text style={{alignSelf: 'flex-start', color: 'red', fontSize: 10, marginBottom: 10}}>{passwordFieldError}</Text>
                            : <></>
                    }
                </View>

                <Button
                    mode="contained"
                    onPress={handleUpdateEmail}
                    color='#46f583'
                    uppercase={false}
                    style={{marginTop: 10, width: '80%'}}
                >Update email</Button>
            </Screen>
        </DismissKeyboard>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'flex-start',
        alignItems: 'center'
    },

    email_input_view: {
        backgroundColor: "#dbd6d2",
        borderRadius: 5,
        width: "100%",
        height: 45,
    },

    email_text_input: {
        height: 45,
        width: "100%",
        textAlign: "left",
        paddingHorizontal: 10
    },

    password_input_view: {
        flexDirection: "row",
        backgroundColor: "#dbd6d2",
        borderRadius: 5,
        width: "100%",
        height: 45,
        alignItems: "center",
        justifyContent: "space-evenly",
    },

    password_text_input: {
        flex: 9,
        height: 45,
        alignItems: "center",
        justifyContent: "center",
        textAlign: "left",
        paddingHorizontal: 10
    },
})