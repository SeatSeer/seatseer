import React, {useState} from 'react';
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
import Ionicons from 'react-native-vector-icons/Ionicons';
import DismissKeyboard from '../DismissKeyboard';

export default function ResetPasswordScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
    const [isConfirmNewPasswordVisible, setIsConfirmNewPasswordVisible] = useState(false);

    function goToLoginScreen() {
        Keyboard.dismiss();
        navigation.navigate("Login");
    }

    return (
        <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={90} style={styles.scrollview_container} contentContainerStyle={styles.content_container}>
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

                    <View style={styles.password_input_view}>
                        <TextInput
                            style={styles.password_text_input}
                            label="Password"
                            autoCapitalize="none"
                            placeholder="Enter new password"
                            placeholderTextColor="#003f5c"
                            secureTextEntry={!isNewPasswordVisible}
                            onChangeText={setNewPassword}
                        />
                        <Ionicons name={isNewPasswordVisible ? "eye" : "eye-off"} size={20} color="gray" onPress={() => setIsNewPasswordVisible(!isNewPasswordVisible)} />
                    </View>

                    <View style={styles.password_input_view}>
                        <TextInput
                            style={styles.password_text_input}
                            label="Re-enter new password"
                            autoCapitalize="none"
                            placeholder="Re-enter new password"
                            placeholderTextColor="#003f5c"
                            secureTextEntry={!isConfirmNewPasswordVisible}
                            onChangeText={setConfirmNewPassword}
                        />
                        <Ionicons name={isConfirmNewPasswordVisible ? "eye" : "eye-off"} size={20} color="gray" onPress={() => setIsConfirmNewPasswordVisible(!isConfirmNewPasswordVisible)} />
                    </View>

                    {/* @todo Reset password functionality */}
                    <TouchableOpacity style={styles.reset_password_button} onPress={() => {}}>
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

    password_input_view: {
        flexDirection: "row",
        backgroundColor: "#dbd6d2",
        borderRadius: 5,
        width: "80%",
        height: 45,
        marginBottom: 10,
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