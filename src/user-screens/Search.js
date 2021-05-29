import React, {useState} from 'react';
import { Text, StyleSheet, View } from 'react-native';

export default function Search() {
    return (
        <View style={styles.container}>
            <Text>Search tab</Text>
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