import React from 'react';
import StartScreen from './StartScreen';
import LoginScreen from "./LoginScreen";
import SignUpScreen from "./SignUpScreen";
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function AuthStack() {
    return (
        <Stack.Navigator
        initialRouteName="Start">
            <Stack.Screen name="Start" component={StartScreen} options={{headerShown: false}} />
            <Stack.Screen name="Login" component={LoginScreen} options={{title: "", headerBackTitle: "Back"}} />
            <Stack.Screen name="SignUp" component={SignUpScreen} options={{title: "", headerBackTitle: "Back"}} />
        </Stack.Navigator>
    );
}