import React, {useState} from 'react';
import { Text, StyleSheet, View } from 'react-native';

export default function Camera() {
    return (
        <View style={styles.container}>
            <Text>QR code scanner tab</Text>
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