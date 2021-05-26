import React, {useState} from 'react';
import { Text, StyleSheet, View } from 'react-native';

export default function Home() {
    return (
        <View style={styles.container}>
            <Text>Home tab</Text>
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