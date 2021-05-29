import { StatusBar } from 'expo-status-bar';
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
import { CommonActions } from "@react-navigation/native";
import DismissKeyboard from '../DismissKeyboard';
import { logIn } from '../../api/auth';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  function handleLogin() {
    Keyboard.dismiss();
    setIsLoginLoading(true);
    logIn({ email, password },
      // onSuccess callback function
      (user) => navigation.dispatch(CommonActions.reset({
        index: 0,
        routes: [{ name: "MainScreen", params: { name: user.displayName }}]
      })),
      // onError callback function
      (error) => {
        setIsLoginLoading(false);
        /** @todo Update text inputs to respond to each error */
        let errorCode = error.code;
        let errorMessage = error.message;
        if (errorCode == 'auth/invalid-email') {
          console.error("Please enter a valid email address");
        } else if (errorCode == 'auth/user-disabled') {
          console.error("Your account has been disabled :P");
        } else if (errorCode == 'auth/user-not-found') {
          console.error(errorMessage);
        } else if (errorCode == 'auth/wrong-password') {
          console.error("Wrong password");
        }
      }
    );
  }

  function goToForgotPasswordScreen() {
    Keyboard.dismiss();
    navigation.navigate("ResetPassword");
  }

  function goToSignUpScreen() {
    Keyboard.dismiss();
    navigation.navigate("SignUp");
  }

  return (
    <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={70} style={styles.scrollview_container} contentContainerStyle={styles.content_container}>
      <DismissKeyboard>
        <View style={styles.view_container}>            
          <StatusBar style="auto" />

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
              placeholder="e.g. password1234"
              placeholderTextColor="#003f5c"
              secureTextEntry={!isPasswordVisible}
              onChangeText={setPassword}
            />
            <Ionicons name={isPasswordVisible ? "eye" : "eye-off"} size={20} color="gray" onPress={() => setIsPasswordVisible(!isPasswordVisible)} />
          </View>
          
          <TouchableOpacity style={styles.forgot_button} onPress={goToForgotPasswordScreen}>
            <Text style={styles.forgot_text}>Forgot your password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.login_button} onPress={handleLogin}>
            <Text style={styles.login_text}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.register_button} onPress={goToSignUpScreen}>
            <Text style={styles.register_text}>Sign up for a SeatSeer account</Text>
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

  view_container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  image: {
    resizeMode: "contain",
    height: 175,
    width: 175,
    marginBottom: 20
  },

  email_input_view: {
    flexDirection: "row",
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

  forgot_button: {
    height: 40,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: "40%"
  },

  forgot_text: {
    color: "#3493F9",
    fontSize: 12,
    textDecorationLine: "underline",
    textDecorationColor: "#3493f9",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },

  login_button: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    backgroundColor: "#46f583",
  },

  register_button: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    backgroundColor: "#ff6961",
  }
});