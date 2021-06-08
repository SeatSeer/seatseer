import React from 'react';
import LoginScreen from "./LoginScreen"
import ForgotPasswordScreen from "./ForgotPasswordScreen"
import SignUpScreen from "./SignUpScreen"
import { createStackNavigator } from '@react-navigation/stack'

const Stack = createStackNavigator();

export default function AuthStack() {
    return (
        <Stack.Navigator
        headerMode="none"
        initialRouteName="Login">
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
        </Stack.Navigator>
    );
}