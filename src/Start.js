import React from 'react';
import LoadingScreen from './LoadingScreen';
import MainTabs from './user-screens/MainTabs';
import VerifyEmailScreen from './auth-screens/VerifyEmailScreen';
import AuthStack from './auth-screens/AuthStack';
import AccountDeleted from './AccountDeleted';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { CustomDefaultTheme, CustomDarkTheme } from '../constants/themes';

const Stack = createStackNavigator();

export default function Start() {
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    const isEmailVerified = useSelector((state) => state.auth.isEmailVerified);
    const isLoading = useSelector((state) => state.auth.isLoading);
    const accountDeleted = useSelector((state) => state.auth.accountDeleted);
    const darkTheme = useSelector((state) => state.theme.darkTheme);

    const theme = darkTheme ? CustomDarkTheme : CustomDefaultTheme;

    return (
        <NavigationContainer theme={theme}>
            <Stack.Navigator
            headerMode="none"
            initialRouteName="LoadingScreen">
                {
                isLoading
                    ? (<Stack.Screen name="LoadingScreen" component={LoadingScreen} />)
                    : isLoggedIn
                        ? (isEmailVerified
                            ? (<Stack.Screen name="MainTabs" component={MainTabs} />)
                            : (<Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />))
                        : (accountDeleted
                            ? (<Stack.Screen name="AccountDeleted" component={AccountDeleted} />)
                            : (<Stack.Screen name="AuthStack" component={AuthStack} />))
                }
            </Stack.Navigator>
        </NavigationContainer>
    )
}