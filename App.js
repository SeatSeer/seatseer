import React from 'react';
import MainScreen from './src/MainScreen';
import MainTabs from './src/user-screens/MainTabs';
import {
  LoginScreen,
  ResetPasswordScreen,
  SignUpScreen,
  VerifyEmailScreen
} from './src/auth-screens/index';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();
const screens = {
  MainScreen: MainScreen,
  Login: LoginScreen,
  ResetPassword: ResetPasswordScreen,
  SignUp: SignUpScreen,
  VerifyEmail: VerifyEmailScreen,
  MainTabs: MainTabs
}

export default function App({ navigation }) {
  return (
    <NavigationContainer>
      <Stack.Navigator
      headerMode="none"
      initialRouteName="MainScreen">
        {Object.entries(screens).map(([name, component]) => (<Stack.Screen key={name} name={name} component={component} />))}
      </Stack.Navigator>
    </NavigationContainer>
  );
}