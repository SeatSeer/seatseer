import React, {useState} from 'react';
import Account from './Account';
import Appearance from './Appearance.js';
import Help from './Help';
import Support from './Support';
import Acknowledgements from './Acknowledgements';
import { Button, Text, StyleSheet, View, ScrollView } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler'
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from '@react-navigation/native';

function Settings({ navigation }) {
    const { colors } = useTheme();

    const settingsOptions = [ 
        {title: "Account Management", icon: " ", subTitle: "Change Account, Delete Account",
          onPress: () => {navigation.navigate("Account")}},
        {title: "Appearance", subTitle: "Dark Mode", onPress: () => {navigation.navigate("Appearance")}},
        {title: "Help", subTitle: "Tutorial", onPress: () => {navigation.navigate("Help")}},
        {title: "Support", subTitle: "Feedback", onPress: () => {navigation.navigate("Support")}},
        {title: "Acknowledgements", subTitle: null, onPress: () => {navigation.navigate("Acknowledgements")}}
    ];

    return (
        <View style={[styles.container, { background: colors.background }]}>
            <ScrollView style = {{color: colors.background}} contentContainerStyle = {styles.scroll_view_container_style}>
            {settingsOptions.map( ({title, subTitle, onPress}, index) =>
              <TouchableOpacity key={title} onPress = {onPress} style={styles.settings_options}>
                  <Text style={{fontSize:17, color: colors.text}}>{title}</Text>
                  {subTitle && <Text style={styles.subtitle_text}>{subTitle}</Text>}
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
    );
}

const SettingsStack = createStackNavigator();
export default function SettingsScreen({ route }) {
    const { email } = route.params;

    return (
        <SettingsStack.Navigator initialRouteName="Settings">
            <SettingsStack.Screen name="Settings" component={Settings} />
            <SettingsStack.Screen name="Account" component={Account} initialParams={{ email }} />
            <SettingsStack.Screen name="Appearance" component={Appearance} />
            <SettingsStack.Screen name="Help" component={Help} />
            <SettingsStack.Screen name="Support" component={Support} />
            <SettingsStack.Screen name="Acknowledgements" component={Acknowledgements} />
        </SettingsStack.Navigator>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },

    scroll_view_container_style: {
      flex: 1,
      alignItems: 'stretch',
      justifyContent: 'space-evenly'
    },

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