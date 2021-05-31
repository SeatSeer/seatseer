import React, {useState} from 'react';
import { Button, Text, StyleSheet, View } from 'react-native';
import { CommonActions } from "@react-navigation/native";
import { logOut } from '../../../api/auth';
import { useTheme } from '@react-navigation/native';

export default function Account({ navigation }) {
    const {colors} = useTheme();

    function handleLogout() {
        logOut(
            // onSuccess callback function
            () => {
                navigation.dispatch(CommonActions.reset({
                    index: 0,
                    routes: [{ name: "MainScreen" }]
                }))
            },
            // onError callback function
            console.error
        );
    }

    return (
      <View style={[styles.container, { background: colors.background }]}>
        <Text style ={{color : colors.text}}>Account Management</Text>
        <Button title={"Log out"} onPress={handleLogout} color="#3493f9" />
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10
      },
})