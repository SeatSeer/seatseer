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
import DismissKeyboard from '../DismissKeyboard';

export default function LoginScreen({ navigation }) {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    function goToLoginScreen() {
        Keyboard.dismiss();
        navigation.navigate("Login");
    }

    return (
        <DismissKeyboard>
            <View style={styles.container}>
                <Image style={styles.image} source={require('../../assets/logo.png')} />

                <View style={styles.password_input_view}>
                <TextInput
                    style={styles.text_input}
                    label="Enter old password"
                    placeholder="Old password"
                    placeholderTextColor="#003f5c"
                    secureTextEntry={true}
                    onChangeText={setOldPassword}
                />
                </View>

                <View style={styles.password_input_view}>
                <TextInput
                    style={styles.text_input}
                    label="Enter new password"
                    placeholder="New password"
                    placeholderTextColor="#003f5c"
                    secureTextEntry={true}
                    onChangeText={setNewPassword}
                />
                </View>

                <View style={styles.password_input_view}>
                <TextInput
                    style={styles.text_input}
                    label="Re-enter new password"
                    placeholder="Re-enter new password"
                    placeholderTextColor="#003f5c"
                    secureTextEntry={true}
                    onChangeText={setConfirmNewPassword}
                />
                </View>

                <TouchableOpacity style={styles.reset_password_button} onPress={() => {}}>
                    <Text style={styles.login_text}>Reset password</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.back_to_login_button} onPress={goToLoginScreen}>
                    <Text style={styles.register_text}>Back to login</Text>
                </TouchableOpacity>
            </View>
        </DismissKeyboard>
    );
}

const styles = StyleSheet.create({
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

    password_input_view: {
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