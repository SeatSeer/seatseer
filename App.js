import React, { useReducer } from 'react';
import MainScreen from './src/MainScreen';
import MainTabs from './src/user-screens/MainTabs';
import {
  LoginScreen,
  ResetPasswordScreen,
  SignUpScreen,
  VerifyEmailScreen
} from './src/auth-screens/index';
import {overallContext} from './src/context';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
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

  const[darkTheme, setDarkTheme] = React.useState(false);
  const themeContext = React.useMemo(() => ({
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
    <NavigationContainer theme = {theme}>
      <Stack.Navigator
      headerMode="none"
      initialRouteName="MainScreen">
        {Object.entries(screens).map(([name, component]) => (<Stack.Screen key={name} name={name} component={component} />))}
      </Stack.Navigator>
    </NavigationContainer>
    </overallContext.Provider>
  );
}