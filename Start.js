import React from 'react';
import MainScreen from './src/MainScreen';
import MainTabs from './src/user-screens/MainTabs';
import VerifyEmailScreen from './src/auth-screens/VerifyEmailScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import AuthStack from './src/auth-screens/AuthStack';
import { CustomDefaultTheme, CustomDarkTheme } from './constants/themes';

const Stack = createStackNavigator();

export default function Start() {
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    const isEmailVerified = useSelector((state) => state.auth.isEmailVerified);
    const isLoading = useSelector((state) => state.auth.isLoading);
    const darkTheme = useSelector((state) => state.theme.darkTheme);

    const theme = darkTheme ? CustomDarkTheme : CustomDefaultTheme;

    return (
            <NavigationContainer theme={theme}>
                <Stack.Navigator
                headerMode="none"
                initialRouteName="MainScreen">
                    {
                    isLoading
                        ? (<Stack.Screen name="MainScreen" component={MainScreen} />)
                        : isLoggedIn
                        ? (isEmailVerified
                            ? (<Stack.Screen name="MainTabs" component={MainTabs} />)
                            : (<Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />))
                        : (<Stack.Screen name="AuthStack" component={AuthStack} />)
                    }
                </Stack.Navigator>
            </NavigationContainer>
    )
}