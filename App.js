import React, { useState } from 'react';
import {
  Home,
  Search,
  Camera,
  Notifications,
  Settings
} from './src/logged-in/index';
import {
  LoginScreen,
  ResetPassword,
  SignUp
} from './src/logged-out/index';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

export default function App({ navigation }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);

  if (!isLoggedIn) {
    if (!forgotPassword) {
      return (<LoginScreen onLoginPress={() => setIsLoggedIn(true)} onForgotPasswordPress={() => setForgotPassword(true)} />);
    } else {
      return (<ResetPassword backToLoginPress={() => setForgotPassword(false)} onLoginPress={() => setIsLoggedIn(true)} />);
    }
  } else {
    return (
      <NavigationContainer>
        <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size}) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = focused
                ? 'home'
                : 'home-outline';
            } else if (route.name === 'Search') {
              iconName = focused
                ? 'search'
                : 'search-outline';
            } else if (route.name === 'Camera') {
              iconName = focused
                ? 'qr-code-sharp'
                : 'qr-code-outline';
            } else if (route.name === 'Notifications') {
              iconName = focused
                ? 'notifications'
                : 'notifications-outline';
            } else if (route.name === 'Settings') {
              iconName = focused
                ? 'cog'
                : 'cog-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          }
        })}
        tabBarOptions={{
          activeTintColor: 'tomato',
          inactiveTintColor: 'gray'
        }}
        >
          <Tab.Screen name="Home" component={Home} />
          <Tab.Screen name="Search" component={Search} />
          <Tab.Screen name="Camera" component={Camera} />
          <Tab.Screen name="Notifications" component={Notifications} options={{ tabBarBadge: 3 }} />
          <Tab.Screen name="Settings" children={() => 
            <Settings onLogoutPress={() => {
              setForgotPassword(false);
              setIsLoggedIn(false);
              }}
            />}
          />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
}