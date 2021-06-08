import React, { useState } from 'react';
import {
    Alert,
    Image,
    Keyboard,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    KeyboardAvoidingView
} from 'react-native';
import DismissKeyboard from '../../misc_components/DismissKeyboard';
import { setOnPasswordReset } from '../../api/auth';

export default function ForgotPasswordScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [isPasswordResetEmailSent, setIsPasswordResetEmailSent] = useState(false);

    function handleResetPassword() {
        setOnPasswordReset(
            email,
            // onSuccessfulResetPasswordEmailSent callback function
            () => {
                Alert.alert(
                    "Reset Password",
                    `An email has been sent to ${email} for you to reset your password`,
                    [{
                        text: "OK"
                    }],
                    { cancelable: true }
                )
                setIsPasswordResetEmailSent(true);
            },
            // onPasswordEmailFailedToSend callback function
            (error) => {
                let errorCode = error.code;
                let errorMessage = error.message;
                if (errorCode == 'auth/invalid-email') {
                    Alert.alert(
                      "Invalid email",
                      'Please enter a valid email.', 
                      [{
                        text: "OK"
                      }],
                      { cancelable: true }
                    )
                } else if (errorCode == 'auth/user-not-found') {
                    Alert.alert(
                      "User not found",
                      `The email you have entered is not registered.`,
                      [{
                        text: "OK"
                      }],
                      { cancelable: true }
                    )
                }
            }
        );
    }

    function goToLoginScreen() {
        Keyboard.dismiss();
        navigation.navigate("Login");
    }

    return (
        <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={1}
        style={styles.scrollview_container}
        contentContainerStyle={styles.content_container}>
            <DismissKeyboard>
                <View style={styles.container}>
                    <Image style={styles.image} source={require('../../assets/logo.png')} />

                    <View style={styles.email_input_view}>
                        <TextInput
                            style={styles.email_text_input}
                            label="Email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            returnKeyType="next"
                            placeholder="e.g. janedoe@example.com"
                            placeholderTextColor="#003f5c"
                            onChangeText={setEmail}
                        />
                    </View>

                    <TouchableOpacity style={styles.reset_password_button} onPress={handleResetPassword}>
                        <Text style={styles.login_text}>Reset password</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.back_to_login_button} onPress={goToLoginScreen}>
                        <Text style={styles.register_text}>Back to login</Text>
                    </TouchableOpacity>
                </View>
            </DismissKeyboard>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    scrollview_container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    
    content_container: {
        alignItems: 'center',
        justifyContent: 'center',
    },

    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10
    },

    image: {
        resizeMode: "contain",
        height: 175,
        width: 175,
        marginBottom: 20
    },

    email_input_view: {
        backgroundColor: "#dbd6d2",
        borderRadius: 5,
        width: "80%",
        height: 45,
        marginBottom: 10,
        alignItems: "center",
        justifyContent: "center"
    },

    email_text_input: {
        height: 45,
        width: "80%",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "left"
    },

    information_text: {
        textAlign: "center"
    },

    reset_password_button: {
        width: "80%",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
        backgroundColor: "#46f583"
    },

    back_to_login_button: {
        width: "80%",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
        backgroundColor: "#ff6961",
    }
})