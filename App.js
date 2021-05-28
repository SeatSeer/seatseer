import React from 'react';
import MainScreen from './src/MainScreen';
import MainTabs from './src/logged-in/MainTabs';
import {
  LoginScreen,
  ResetPassword,
  SignUp
} from './src/logged-out/index';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();
const screens = {
  MainScreen: MainScreen,
  Login: LoginScreen,
  ResetPassword: ResetPassword,
  SignUp: SignUp,
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