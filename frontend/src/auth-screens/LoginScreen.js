import React, { useRef, useState, useEffect } from 'react';
import {
  Alert,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Screen from '../../misc_components/Screen';
import CustomText from '../../misc_components/CustomText';
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
        <Screen screenStyle={styles.view_container}>
          <CustomText text="Welcome back!" textStyle={{fontWeight: 'bold', fontSize: 35}} />

          <CustomText text="We're so excited to see you again!" textStyle={{fontSize: 15}} />

          <View style={{marginTop: 30, width: '80%', alignItems: 'center'}}>
            <CustomText text="ACCOUNT INFORMATION" textStyle={{marginBottom: 5, fontSize: 10, alignSelf: 'flex-start'}} />

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
                allowFontScaling={false}
              />
            </View>
            {
              emailFieldError
                ? <CustomText text={emailFieldError} textStyle={{alignSelf: 'flex-start', color: 'red', fontSize: 10, marginBottom: 10}} />
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
                allowFontScaling={false}
              />
              <Ionicons name={isPasswordVisible ? "eye-off" : "eye"} size={20} color="gray" onPress={() => setIsPasswordVisible(!isPasswordVisible)} style={{flex: 1}} />
            </View>
            {
              passwordFieldError
                ? <CustomText text={passwordFieldError} textStyle={{alignSelf: 'flex-start', color: 'red', fontSize: 10}} />
                : <></>
            }
            
            <TouchableOpacity style={{alignSelf: 'flex-start', marginVertical: 10}} onPress={handleResetPassword}>
              <CustomText text="Forgot your password?" textStyle={styles.forgot_text} />
            </TouchableOpacity>
          </View>

          <Button
            mode="contained"
            onPress={handleLogin}
            color='#46f583'
            uppercase={false}
            style={{width: '80%'}}
          >Login</Button>
        </Screen>
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
    paddingHorizontal: 10,
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
    paddingHorizontal: 10,
  },

  forgot_text: {
    color: "#3493F9",
    fontSize: 12,
    textDecorationLine: "underline",
    textDecorationColor: "#3493f9",
  },
});