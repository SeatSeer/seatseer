import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Keyboard,
    StyleSheet,
    Text,
    TextInput,
    View,
    SafeAreaView,
    KeyboardAvoidingView
} from 'react-native';
import Screen from '../../misc_components/Screen';
import CustomText from '../../misc_components/CustomText';
import { Button } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DismissKeyboard from '../../misc_components/DismissKeyboard';
import { createAccount } from '../../api/auth';
import { initializeDarkTheme, initializeNotifications } from '../../api/rtdb';
import { setStateToIsLoading } from '../../store/slices/authSlice';
import { useDispatch } from 'react-redux';

export default function SignUpScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [reEnterPassword, setReEnterPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isReEnterPasswordVisible, setIsReEnterPasswordVisible] = useState(false);
    const usernameTextInput = useRef();
    const emailTextInput = useRef();
    const passwordTextInput = useRef();
    const reEnterPasswordTextInput = useRef();

    const dispatch = useDispatch();

    useEffect(() => {
        usernameTextInput.current.focus();
    }, []);

    function handleSignUp() {
        Keyboard.dismiss();
        if (password !== reEnterPassword) {
            Alert.alert(
                "Passwords don't match",
                `The password you have re-entered is not the same as the password you initially keyed in.`,
                [{
                    text: "OK"
                }],
                { cancelable: true }
            )
        } else {
            createAccount({ name, email, password },
                // onSuccess callback function
                async (user) => {
                    await initializeNotifications(user.uid, () => {}, console.error);
                    await initializeDarkTheme(user.uid, () => {}, console.error);
                    dispatch(setStateToIsLoading());
                },
                // onError callback function
                (error) => {
                    setIsRegisterLoading(false);
                    let errorCode = error.code;
                    if (errorCode == 'auth/email-already-in-use') {
                        Alert.alert(
                            "Email already in use",
                            `This email is already associated with an account.`,
                            [{
                                text: "OK"//, onPress: () => console.error("Email already used")
                            }],
                            { cancelable: true }
                        )
                    } else if (errorCode == 'auth/invalid-email') {
                        Alert.alert(
                            "Invalid email",
                            `Please enter a valid email`,
                            [{
                                text: "OK"//, onPress: () => console.error("Invalid email")
                            }],
                            { cancelable: true }
                        )
                    } else if (errorCode == 'auth/weak-password') {
                        Alert.alert(
                            "Password too weak",
                            `Please enter a password that is at least 6 characters long`,
                            [{
                                text: "OK"//, onPress: () => console.error(errorMessage)
                            }],
                            { cancelable: true }
                        )
                    } else {
                        Alert.alert(
                            "ILLEGAL",
                            `Please don't hack us :(`,
                            [{
                                text: "OK"//, onPress: () => console.error(error)
                            }],
                            { cancelable: true }
                        )
                    }
                }
            );
        }
    }

    return (
        <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{flex: 1}}>
            <DismissKeyboard>
                <Screen screenStyle={styles.container}>
                    <CustomText text="Registration is easy!" textStyle={{fontWeight: 'bold', fontSize: 35}} />

                    <CustomText text="Just key in the following details!" textStyle={{fontSize: 15}} />

                    <View style={{marginTop: 15, width: '80%', alignItems: 'center'}}>
                        <View style={styles.email_input_view}>
                            <TextInput
                                ref={usernameTextInput}
                                style={styles.text_input}
                                placeholder="Username"
                                returnKeyType="next"
                                placeholderTextColor="#003f5c"
                                onChangeText={setName}
                                onSubmitEditing={() => emailTextInput.current.focus()}
                                allowFontScaling={false}
                            />
                        </View>

                        <View style={styles.email_input_view}>
                            <TextInput
                                ref={emailTextInput}
                                style={styles.text_input}
                                autoCapitalize="none"
                                returnKeyType="next"
                                keyboardType="email-address"
                                placeholder="Email"
                                placeholderTextColor="#003f5c"
                                onChangeText={setEmail}
                                onSubmitEditing={() => passwordTextInput.current.focus()}
                                allowFontScaling={false}
                            />
                        </View>

                        <View style={styles.password_input_view}>
                            <TextInput
                                ref={passwordTextInput}
                                style={styles.password_text_input}
                                autoCapitalize="none"
                                placeholder="Password"
                                returnKeyType="next"
                                placeholderTextColor="#003f5c"
                                secureTextEntry={!isPasswordVisible}
                                onChangeText={setPassword}
                                onSubmitEditing={() => reEnterPasswordTextInput.current.focus()}
                                allowFontScaling={false}
                            />
                            <Ionicons name={isPasswordVisible ? "eye-off" : "eye"} size={20} color="gray" onPress={() => setIsPasswordVisible(!isPasswordVisible)} style={{flex: 1}} />
                        </View>

                        <View style={styles.password_input_view}>
                            <TextInput
                                ref={reEnterPasswordTextInput}
                                style={styles.password_text_input}
                                autoCapitalize="none"
                                placeholder="Re-enter password"
                                returnKeyType="go"
                                placeholderTextColor="#003f5c"
                                secureTextEntry={!isReEnterPasswordVisible}
                                onChangeText={setReEnterPassword}
                                onSubmitEditing={handleSignUp}
                                allowFontScaling={false}
                            />
                            <Ionicons name={isReEnterPasswordVisible ? "eye-off" : "eye"} size={20} color="gray" onPress={() => setIsReEnterPasswordVisible(!isReEnterPasswordVisible)} style={{flex: 1}} />
                        </View>
                    </View>

                    <Button
                        mode="contained"
                        onPress={handleSignUp}
                        color='#46f583'
                        uppercase={false}
                        style={{marginTop: 10, width: '80%'}}
                    >Create an account</Button>
                </Screen>            
            </DismissKeyboard>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create ({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },

    email_input_view: {
        backgroundColor: "#dbd6d2",
        borderRadius: 5,
        width: "100%",
        height: 45,
        marginBottom: 10
    },
    
    text_input: {
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
        marginBottom: 10,
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