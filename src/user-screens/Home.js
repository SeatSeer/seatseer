import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useSelector } from 'react-redux';

export default function Home() {
    const { colors } = useTheme();
    const currentUserDisplayName = useSelector((state) => state.auth.currentUserDisplayName);
    return (
        <View style={[styles.container, { background: colors.background }]}>
            <Text style = {{ color: colors.text }}>Home tab</Text>
            <Text style = {{ color: colors.text }}>Welcome, {currentUserDisplayName}</Text>
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