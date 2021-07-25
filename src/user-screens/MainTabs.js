import React, { useEffect } from 'react';
import Home from './Home';
import Search from './Search/Search';
import NotificationsTab from './Notifications/NotificationsTab';
import SettingsTab from './Settings/SettingsTab';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { setNotificationHandler } from 'expo-notifications';
import { changeUnreadNotifications } from '../../api/rtdb';
import { useDispatch, useSelector } from 'react-redux';
import { incrementUnreadNotifs, decrementUnreadNotifs } from '../../store/slices/notificationsSlice';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  const currentUserId = useSelector((state) => state.auth.currentUserId);
  const unreadNotifications = useSelector((state) => state.notifications.unreadNotifications);
  const dispatch = useDispatch();

  useEffect(() => {
    setNotificationHandler({
      handleNotification: async (notification) => {
          const notifBody = notification.request.content.body;
          const notifData = notification.request.content.data;
          // If room is available
          if (notifData['type'] === 'ON') {
            changeUnreadNotifications(currentUserId, unreadNotifications + 1,
              (newUnreadNotifs) => dispatch(incrementUnreadNotifs()),
              (error) => console.error(`FAILED TO INCREMENT`)
            )
          } else if (notifData['type'] === 'OFF') {
            changeUnreadNotifications(currentUserId, unreadNotifications - 1,
              (newUnreadNotifs) => dispatch(decrementUnreadNotifs()),
              (error) => console.error(`FAILED TO DECREMENT`)
            )
          } else if (notifData['type'] === 'EXPIRED') {
            changeUnreadNotifications(currentUserId, unreadNotifications - 1,
              (newUnreadNotifs) => dispatch(decrementUnreadNotifs()),
              (error) => console.error(`FAILED TO EXPIRE`)
            )
          }
          return {
              // User hasn't responded to previous notif and a new notif has been received
              // Delete the previous notif, and send the new notif
              shouldShowAlert: true,
              shouldPlaySound: false,
              shouldSetBadge: false,
          }
      },
      handleSuccess: (notificationId) => {
          console.log(`Successfully handled notif: ${notificationId}`)
      },
      handleError: (error) => console.error(error)
  });
  }, []);

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
          inactiveTintColor: 'gray',
          keyboardHidesTabBar: true
        }}
        >
          <Tab.Screen name="Home" component={Home} />
          <Tab.Screen name="Search" component={Search} />
          <Tab.Screen name="Notifications" 
            component={NotificationsTab} 
            options={{ tabBarBadge: null }}
          />
          <Tab.Screen name="Settings" component={SettingsTab} />
        </Tab.Navigator>
    );
}