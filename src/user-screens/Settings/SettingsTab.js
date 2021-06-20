import React from 'react';
import Settings from './Settings';
import ChangePassword from './ChangePassword';
import UpdateEmail from './UpdateEmail';
import DeleteAccountAuthentication from './DeleteAccountAuthentication';
import Tutorial from './Tutorial';
import { createStackNavigator } from '@react-navigation/stack';

const SettingsStack = createStackNavigator();

export default function SettingsTab() {
    return (
        <SettingsStack.Navigator initialRouteName="Settings">
            <SettingsStack.Screen name="Settings" component={Settings} />
            <SettingsStack.Screen name="ChangePassword" component={ChangePassword} />
            <SettingsStack.Screen name="UpdateEmail" component={UpdateEmail} />
            <SettingsStack.Screen name="DeleteAccountAuthentication" component={DeleteAccountAuthentication} />
            <SettingsStack.Screen name="Tutorial" component={Tutorial} />
        </SettingsStack.Navigator>
    );
}