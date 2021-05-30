import React, {useState} from 'react';
import { Button, Text, StyleSheet, View } from 'react-native';
import { CommonActions } from "@react-navigation/native";
import { logOut } from '../../../api/auth';

export default function Account({ navigation }) {
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
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Account Management</Text>
        <Button title={"Log out"} onPress={handleLogout} color="#3493f9" />
      </View>
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