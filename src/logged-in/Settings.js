import React, {useState} from 'react';
import { Button, Text, StyleSheet, View } from 'react-native';

export default function Settings(props) {
    return (
        <View style={styles.container}>
            <Text>Settings tab</Text>
            <Button title={"Log out"} onPress={props.onLogoutPress} color="#3493f9" />
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