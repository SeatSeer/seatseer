import React from 'react';
import Settings from './Settings';
import ChangePassword from './ChangePassword';
import UpdateEmail from './UpdateEmail';
import DeleteAccountAuthentication from './DeleteAccountAuthentication';
import Feedback from './Feedback';
import ReportFaultySeat from './ReportFaultySeat';
import { createStackNavigator } from '@react-navigation/stack';

const SettingsStack = createStackNavigator();

export default function SettingsTab() {
    return (
        <SettingsStack.Navigator initialRouteName="Settings">
            <SettingsStack.Screen name="Settings" component={Settings} />
            <SettingsStack.Screen name="ChangePassword" component={ChangePassword} options={{title: "Reset Password"}} />
            <SettingsStack.Screen name="UpdateEmail" component={UpdateEmail} options={{title: "Update Email"}} />
            <SettingsStack.Screen name="DeleteAccountAuthentication" component={DeleteAccountAuthentication} options={{title: "Delete Account"}} />
            <SettingsStack.Screen name="Feedback" component={Feedback} options={{title: "Feedback Form"}} />
            <SettingsStack.Screen name="ReportFaultySeat" component={ReportFaultySeat} options={{headerShown: false}} />
        </SettingsStack.Navigator>
    );
}