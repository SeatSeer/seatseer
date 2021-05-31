import React, { useContext } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { useTheme } from '@react-navigation/native';

export default function Home({ route }) {
    const { colors } = useTheme();
    return (
        <View style={[styles.container, { background: colors.background }]}>
            <Text style = {{color:colors.text}}>Home tab</Text>
            <Text style = {{color:colors.text}}>Welcome, {route.params.name}</Text>
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