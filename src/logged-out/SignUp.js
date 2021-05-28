import React, {useState} from 'react';
import {
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { CommonActions } from "@react-navigation/native";
import DismissKeyboard from '../DismissKeyboard';
import { createAccount } from '../../api/auth';

export default function SignUp({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegisterLoading, setIsRegisterLoading] = useState(false);

    function handleSignUp() {
        Keyboard.dismiss();
        setIsRegisterLoading(true);
        createAccount( {name, email, password },
            // onSuccess callback function
            (user) => {
                navigation.dispatch(CommonActions.reset({
                    index: 0,
                    routes: [{ name: "MainTabs", params: { name: user.displayName }}]
                }));
            },
            // onError callback function
            (error) => {
                setIsRegisterLoading(false);
                return console.error(error);
            }
        );
    }

    function goToLoginScreen() {
        Keyboard.dismiss();
        navigation.navigate("Login");
    }

    return (
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
                        style={styles.text_input}
                        label="Enter password"
                        placeholder="e.g. password1234"
                        placeholderTextColor="#003f5c"
                        secureTextEntry={true}
                        onChangeText={setPassword}
                    />
                </View>

                <TouchableOpacity style={styles.register_button} onPress={handleSignUp}>
                    <Text style={styles.register_text}>Register</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.back_to_login_button} onPress={goToLoginScreen}>
                    <Text style={styles.back_to_login_text}>Return to login</Text>
                </TouchableOpacity>
            </View>
        </DismissKeyboard>
    )
}

const styles = StyleSheet.create ({
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
    
      password_input_view: {
        backgroundColor: "#dbd6d2",
        borderRadius: 5,
        width: "80%",
        height: 45,
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