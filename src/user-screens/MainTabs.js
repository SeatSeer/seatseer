import React from 'react';
import Home from './Home';
import Search from './Search';
import Camera from './Camera';
import Notifications from './Notifications';
import SettingsTab from './Settings/SettingsTab';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
    return (
        <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
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
          <Tab.Screen name="Settings" component={SettingsTab} />
        </Tab.Navigator>
    );
}