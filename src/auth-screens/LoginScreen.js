import React, { useRef, useState, useEffect } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView
} from 'react-native';
import { Button } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DismissKeyboard from '../../misc_components/DismissKeyboard';
import { logIn, setOnPasswordReset } from '../../api/auth';
import { setStateToIsLoading } from '../../store/slices/authSlice';
import { useDispatch } from 'react-redux';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPasswordResetEmailSent, setIsPasswordResetEmailSent] = useState(false);
  const [emailFieldError, setEmailFieldError] = useState(null);
  const [passwordFieldError, setPasswordFieldError] = useState(null);
  const emailTextInput = useRef();
  const passwordTextInput = useRef();

  const dispatch = useDispatch();

  useEffect(() => {
    emailTextInput.current.focus();
  }, []);

  function handleLogin() {
    setEmailFieldError(null);
    setPasswordFieldError(null);
    logIn({ email, password },
      // onSuccess callback function
      (user) => dispatch(setStateToIsLoading()),
      // onError callback function
      (error) => {
        let errorCode = error.code;
        if (errorCode == 'auth/invalid-email') {
          Alert.alert(
            "Invalid email",
            'Please enter a valid email.', 
            [{
              text: "OK"
            }],
            { cancelable: true }
          )
          setEmailFieldError('Please enter a valid email.');
        } else if (errorCode == 'auth/user-disabled') {
          Alert.alert(
            "User disabled",
            'Your account has been disabled.',
            [{
              text: "OK"
            }],
            { cancelable: true }
          )
          setEmailFieldError('Your account has been disabled.');
        } else if (errorCode == 'auth/user-not-found') {
          Alert.alert(
            "User not found",
            `The email you have entered is not registered.`,
            [{
              text: "OK"
            }],
            { cancelable: true }
          )
          setEmailFieldError('Email not registered yet.');
        } else if (errorCode == 'auth/wrong-password') {
          Alert.alert(
            "Wrong password",
            "The password you have entered is wrong.",
            [{
              text: "OK"
            }],
            { cancelable: true }
          )
          setPasswordFieldError('Wrong password.')
        }
      }
    );
  }

  function handleResetPassword() {
    setEmailFieldError(null);
    setPasswordFieldError(null);
    setOnPasswordReset(email,
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
        if (errorCode == 'auth/invalid-email') {
          Alert.alert(
            "Invalid email",
            'Please enter a valid email.', 
            [{
              text: "OK"
            }],
            { cancelable: true }
          )
          setEmailFieldError('Please enter a valid email.');
        } else if (errorCode == 'auth/user-not-found') {
          Alert.alert(
            "User not found",
            `The email you have entered is not registered.`,
            [{
              text: "OK"
            }],
            { cancelable: true }
          )
          setEmailFieldError('Email not registered yet.');
        }
      }
    );
  }

  return (
      <DismissKeyboard>
        <SafeAreaView style={styles.view_container}>
          <Text style={{fontWeight: 'bold', fontSize: 35}}>
            Welcome back!
          </Text>

          <Text style={{fontSize: 15}}>
            We're so excited to see you again!
          </Text>

          <View style={{marginTop: 30, width: '80%', alignItems: 'center'}}>
            <Text style={{marginBottom: 5, fontSize: 10, alignSelf: 'flex-start'}}>
              ACCOUNT INFORMATION
            </Text>

            <View style={{...styles.email_input_view, borderWidth: emailFieldError ? 1 : 0, borderColor: 'red', marginBottom: emailFieldError ? 0 : 10}}>
              <TextInput
                ref={emailTextInput}
                style={styles.email_text_input}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
                placeholder="Email"
                placeholderTextColor="#003f5c"
                onChangeText={setEmail}
                onSubmitEditing={() => passwordTextInput.current.focus()}
              />
            </View>
            {
              emailFieldError
                ? <Text style={{alignSelf: 'flex-start', color: 'red', fontSize: 10, marginBottom: 10}}>{emailFieldError}</Text>
                : <></>
            }

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
                onSubmitEditing={handleLogin}
              />
              <Ionicons name={isPasswordVisible ? "eye-off" : "eye"} size={20} color="gray" onPress={() => setIsPasswordVisible(!isPasswordVisible)} style={{flex: 1}} />
            </View>
            {
              passwordFieldError
                ? <Text style={{alignSelf: 'flex-start', color: 'red', fontSize: 10, marginBottom: 10}}>{passwordFieldError}</Text>
                : <></>
            }
            
            <TouchableOpacity style={styles.forgot_button} onPress={handleResetPassword}>
              <Text style={styles.forgot_text}>Forgot your password?</Text>
            </TouchableOpacity>
          </View>

          <Button
            mode="contained"
            onPress={handleLogin}
            color='#46f583'
            uppercase={false}
            style={{marginTop: 10, width: '80%'}}
          >Login</Button>
          
        </SafeAreaView>
      </DismissKeyboard>
  );
}

const styles = StyleSheet.create({
  view_container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
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

  forgot_button: {
    height: 40,
    alignSelf: 'flex-start',
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