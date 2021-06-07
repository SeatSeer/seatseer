import React, { useState } from 'react';
import {
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView
} from 'react-native';
import DismissKeyboard from '../DismissKeyboard';
import { setOnPasswordReset } from '../../api/auth';

export default function ResetPasswordScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [isPasswordResetEmailSent, setIsPasswordResetEmailSent] = useState(false);

    function handleResetPassword() {
        setOnPasswordReset(
            email,
            // onSuccessfulResetPasswordEmailSent callback function
            () => {
                setIsPasswordResetEmailSent(true);
            },
            // onPasswordEmailFailedToSend callback function
            (error) => {
                console.error(error);
            }
        );
    }

    function goToLoginScreen() {
        Keyboard.dismiss();
        navigation.navigate("Login");
    }

    return (
        <KeyboardAvoidingView behavior = {Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={1} style={styles.scrollview_container} contentContainerStyle={styles.content_container}>
            <DismissKeyboard>
                <View style={styles.container}>
                    <Image style={styles.image} source={require('../../assets/logo.png')} />

                    {!isPasswordResetEmailSent
                        ? (<View style={styles.email_input_view}>
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
                        </View>)
                        : (<View>
                            <Text style={styles.information_text}>An email has been sent to {email} for you to reset your password.</Text>
                        </View>)}

                    {!isPasswordResetEmailSent
                        ? (<TouchableOpacity style={styles.reset_password_button} onPress={handleResetPassword}>
                            <Text style={styles.login_text}>Reset password</Text>
                        </TouchableOpacity>)
                        : (<View />)
                    }

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