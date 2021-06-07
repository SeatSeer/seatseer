import { DarkTheme, DefaultTheme } from '@react-navigation/native';

export const CustomDefaultTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: 'rgb(255, 45, 85)',
      background: '#ffffff',
      text: '#333333'
    },
};

export const CustomDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: '#333333',
      text: '#ffffff'
    },
};