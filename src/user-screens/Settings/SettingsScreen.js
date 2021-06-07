import React from 'react';
import Account from './Account';
import Appearance from './Appearance.js';
import Help from './Help';
import Support from './Support';
import Acknowledgements from './Acknowledgements';
import Screen from '../../../misc_components/Screen';
import CustomText from '../../../misc_components/CustomText';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

function Settings({ navigation }) {
  const settingsOptions = [
    {
      title: "Account Management",
      subTitle: "Change Account, Delete Account",
      onPress: () => {navigation.navigate("Account")}
    },
    {
      title: "Appearance",
      subTitle: "Dark Mode",
      onPress: () => {navigation.navigate("Appearance")}
    },
    {
      title: "Help",
      subTitle: "Tutorial",
      onPress: () => {navigation.navigate("Help")}
    },
    {
      title: "Support",
      subTitle: "Feedback",
      onPress: () => {navigation.navigate("Support")}
    },
    {
      title: "Acknowledgements",
      subTitle: null,
      onPress: () => {navigation.navigate("Acknowledgements")}
    }
  ];

  return (
    <Screen scrollable={true}>
      {
        settingsOptions.map(({ title, subTitle, onPress }, index) => (
          <TouchableOpacity key={title} onPress={onPress} style={styles.settings_options}>
            <CustomText text={title} textStyle={{ fontSize: 17 }} />
            {subTitle && <CustomText text={subTitle} style={styles.subtitle_text} />}
          </TouchableOpacity>
        ))
      }
    </Screen>
  );
}

const SettingsStack = createStackNavigator();
export default function SettingsScreen() {
    return (
        <SettingsStack.Navigator initialRouteName="Settings">
            <SettingsStack.Screen name="Settings" component={Settings} />
            <SettingsStack.Screen name="Account" component={Account} />
            <SettingsStack.Screen name="Appearance" component={Appearance} />
            <SettingsStack.Screen name="Help" component={Help} />
            <SettingsStack.Screen name="Support" component={Support} />
            <SettingsStack.Screen name="Acknowledgements" component={Acknowledgements} />
        </SettingsStack.Navigator>
    );
}

const styles = StyleSheet.create({
    settings_options: {
        height: 45,
        borderBottomWidth: 1,
        borderBottomColor: '#adb5bd'
    },

    subtitle_text: {
      fontSize: 14,
      opacity: 0.75,
      color: '#adb5bd',
      paddingTop: 5
    }
})