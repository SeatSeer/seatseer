import React from 'react';
import LoginScreen from './LoginScreen';
import ResetPassword from './ResetPassword';
import SignUp from './SignUp';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function AuthScreens() {
    return (
        <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="ResetPassword" component={ResetPassword} />
            <Stack.Screen name="SignUp" component={SignUp} />
        </Stack.Navigator>
    );
}