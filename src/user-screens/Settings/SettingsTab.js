import React from 'react';
import Settings from './Settings';
import ChangePassword from './ChangePassword';
import UpdateEmail from './UpdateEmail';
import DeleteAccountAuthentication from './DeleteAccountAuthentication';
import Tutorial from './Tutorial';
import Feedback from './Feedback';
import ReportFaultySeat from './ReportFaultySeat';
import { createStackNavigator } from '@react-navigation/stack';

const SettingsStack = createStackNavigator();

export default function SettingsTab() {
    return (
        <SettingsStack.Navigator initialRouteName="Settings">
            <SettingsStack.Screen name="Settings" component={Settings} />
            <SettingsStack.Screen name="ChangePassword" component={ChangePassword} />
            <SettingsStack.Screen name="UpdateEmail" component={UpdateEmail} options={{title: ""}} />
            <SettingsStack.Screen name="DeleteAccountAuthentication" component={DeleteAccountAuthentication} options={{title: ""}} />
            <SettingsStack.Screen name="Tutorial" component={Tutorial} />
            <SettingsStack.Screen name="Feedback" component={Feedback} options={{title: ""}} />
            <SettingsStack.Screen name="ReportFaultySeat" component={ReportFaultySeat} options={{title: ""}} />
        </SettingsStack.Navigator>
    );
}