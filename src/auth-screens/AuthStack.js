import React from 'react';
import LoginScreen from "./LoginScreen"
import ResetPasswordScreen from "./ResetPasswordScreen"
import SignUpScreen from "./SignUpScreen"
import { createStackNavigator } from '@react-navigation/stack'

const Stack = createStackNavigator();

export default function AuthStack() {
    return (
        <Stack.Navigator
        headerMode="none"
        initialRouteName="Login">
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
        </Stack.Navigator>
    );
}