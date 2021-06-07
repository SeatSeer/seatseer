import React, { useState, useMemo } from 'react';
import MainScreen from './src/MainScreen';
import MainTabs from './src/user-screens/MainTabs';
import VerifyEmailScreen from './src/auth-screens/VerifyEmailScreen';
import { overallContext } from './src/context';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import AuthStack from './src/auth-screens/AuthStack';

const Stack = createStackNavigator();

export default function Start() {
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    const isEmailVerified = useSelector((state) => state.auth.isEmailVerified);
    const isLoading = useSelector((state) => state.auth.isLoading);

    const[darkTheme, setDarkTheme] = useState(false);
    const themeContext = useMemo(() => ({
      toggleTheme: () => {
        setDarkTheme( darkTheme => !darkTheme );
      }
    }), []);
    const CustomDefaultTheme = {
      ...DefaultTheme,
      colors: {
        ...DefaultTheme.colors,
        primary: 'rgb(255, 45, 85)',
        background: '#ffffff',
        text: '#333333'
      },
    };
    const CustomDarkTheme = {
      ...DarkTheme,
      colors: {
        ...DarkTheme.colors,
        background: '#333333',
        text: '#ffffff'
      },
    };
    const theme = darkTheme ? CustomDarkTheme : CustomDefaultTheme;

    return (
        <overallContext.Provider value={themeContext}>
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
      </overallContext.Provider>
    )
}