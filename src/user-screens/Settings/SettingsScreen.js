import React, {useState} from 'react';
import Account from './Account';
import Appearance from './Appearance.js';
import Help from './Help';
import Support from './Support';
import Acknowledgements from './Acknowledgements';
import { Button, Text, StyleSheet, View, ScrollView } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler'
import { createStackNavigator } from '@react-navigation/stack';

function Settings({ navigation }) {
    const settingsOptions = [ 
        {title: "Account Management", icon: " ", subTitle: "Change Account, Delete Account",
          onPress: () => {navigation.navigate("Account")}},
        {title: "Appearance", subTitle: "Dark Mode", onPress: () => {navigation.navigate("Appearance")}},
        {title: "Help", subTitle: "Tutorial", onPress: () => {navigation.navigate("Help")}},
        {title: "Support", subTitle: "Feedback", onPress: () => {navigation.navigate("Support")}},
        {title: "Acknowledgements", subTitle: null, onPress: () => {navigation.navigate("Acknowledgements")}}
    ];

    return (
        <View style={styles.container}>
            <ScrollView style = {{color:'#ffffff'}}>
            {settingsOptions.map(({title, subTitle, onPress}, index)=>
              <TouchableOpacity key={title} onPress = {onPress}>
                  <View style={{height:0.5, backgroundColor: '#adb5bd'}}/>
                <View style={{paddingHorizontal:20, paddingBottom:20, paddingTop:20}}/>
                <View>
                  <Text style={{fontSize:17}}>{title}</Text>
                  {subTitle && <Text style={{fontSize:14, opacity:0.75, color:'#adb5bd', paddingTop: 5}}>{subTitle}</Text>}
                </View>
                <View style={{height:0.5, backgroundColor: '#adb5bd'}}/>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
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
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10
      },
})