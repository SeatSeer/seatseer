import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import DismissKeyboard from '../DismissKeyboard';

export default function LoginScreen(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Function to check if email entered is valid
  // function validate(email) {
  //   regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  //   if (regex.test(email)) {
  //     setEmail("Email is valid");
  //     return true;
  //   } else {
  //     setEmail("Email is invalid!");
  //     return false;
  //   }
  // }

  return (
    <DismissKeyboard>
      <View style={styles.container}>
        <StatusBar style="auto" />

        <Image style={styles.image} source={require('../../assets/logo.png')} />
        
        <View style={styles.email_input_view}>
          <TextInput
            style={styles.text_input}
            placeholder="Email"
            placeholderTextColor="#003f5c"
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.password_input_view}>
          <TextInput
            style={styles.text_input}
            placeholder="Password"
            placeholderTextColor="#003f5c"
            secureTextEntry={true}
            onChangeText={setPassword}
          />
        </View>
        
        <TouchableOpacity style={styles.forgot_button} onPress={props.onForgotPasswordPress}>
          <Text style={styles.forgot_text}>Forgot your password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.login_button} onPress={props.onLoginPress}>
          <Text style={styles.login_text}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.register_button}>
          <Text style={styles.register_text}>Sign up for a SeatSeer account</Text>
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

  email_input_view: {
    backgroundColor: "#dbd6d2",
    borderRadius: 30,
    width: "80%",
    height: 45,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center"
  },

  password_input_view: {
    backgroundColor: "#dbd6d2",
    borderRadius: 30,
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