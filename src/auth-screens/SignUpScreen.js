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
import Ionicons from 'react-native-vector-icons/Ionicons';
import DismissKeyboard from '../../misc_components/DismissKeyboard';
import { createAccount } from '../../api/auth';
import { setStateToIsLoading } from '../../store/slices/authSlice';
import { useDispatch } from 'react-redux';

export default function SignUpScreen({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isRegisterLoading, setIsRegisterLoading] = useState(false);

    const dispatch = useDispatch();

    function handleSignUp() {
        Keyboard.dismiss();
        setIsRegisterLoading(true);
        createAccount({ name, email, password },
            // onSuccess callback function
            (user) => {
                dispatch(setStateToIsLoading());
            },
            // onError callback function
            (error) => {
                setIsRegisterLoading(false);
                /** @todo Update text inputs to respond to each error */
                let errorCode = error.code;
                let errorMessage = error.message;
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

    function goToLoginScreen() {
        Keyboard.dismiss();
        navigation.navigate("Login");
    }

    return (
        <KeyboardAvoidingView behavior = {Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={80} style={styles.scrollview_container} contentContainerStyle={styles.content_container}>
            <DismissKeyboard>
                <View style={styles.container}>
                    <Image style={styles.image} source={require('../../assets/logo.png')} />

                    <View style={styles.email_input_view}>
                        <TextInput
                            style={styles.text_input}
                            label="Enter your name"
                            placeholder="e.g. Jane"
                            placeholderTextColor="#003f5c"
                            onChangeText={setName}
                        />
                    </View>

                    <View style={styles.email_input_view}>
                        <TextInput
                            style={styles.text_input}
                            label="Enter email"
                            autoCapitalize="none"
                            keyboardType="email-address"
                            placeholder="e.g. janedoe@example.com"
                            placeholderTextColor="#003f5c"
                            onChangeText={setEmail}
                        />
                    </View>

                    <View style={styles.password_input_view}>
                        <TextInput
                            style={styles.password_text_input}
                            label="Enter password"
                            placeholder="e.g. password1234"
                            placeholderTextColor="#003f5c"
                            secureTextEntry={!isPasswordVisible}
                            onChangeText={setPassword}
                        />
                        <Ionicons name={isPasswordVisible ? "eye" : "eye-off"} size={20} color="gray" onPress={() => setIsPasswordVisible(!isPasswordVisible)} />
                    </View>

                    <TouchableOpacity style={styles.register_button} onPress={handleSignUp}>
                        <Text style={styles.register_text}>Register</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.back_to_login_button} onPress={goToLoginScreen}>
                        <Text style={styles.back_to_login_text}>Return to login</Text>
                    </TouchableOpacity>
                </View>
            </DismissKeyboard>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create ({
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

    text_input: {
        height: 45,
        width: "80%",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "left"
    },
    
    password_input_view: {
        flexDirection: "row",
        backgroundColor: "#dbd6d2",
        borderRadius: 5,
        width: "80%",
        height: 45,
        alignItems: "center",
        justifyContent: "center"
    },

    password_text_input: {
        height: 45,
        width: "80%",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "left",
        borderLeftWidth: 10,
        /** @todo Come up with a better way to align the email and password text */
        borderColor: "#dbd6d2"
    },

    register_button: {
        width: "80%",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
        backgroundColor: "#46f583",
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