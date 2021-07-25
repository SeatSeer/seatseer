import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Notifications from './Notifications';
import GeneralNotificationsSettings from './GeneralNotificationsSettings';

const NotificationsStack = createStackNavigator();

export default function NotificationsTab() {
    return (
        <NotificationsStack.Navigator initialRouteName="Notifications" screenOptions={{headerTitleAlign: 'center'}}>
            <NotificationsStack.Screen 
                name="Notifications"
                component={Notifications}
            />
            <NotificationsStack.Screen
                name="GeneralNotificationsSettings"
                component={GeneralNotificationsSettings}
                options={{ title: 'General Notification Settings' }}
            />
        </NotificationsStack.Navigator>
    )
}