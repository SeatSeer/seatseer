import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from "react-native";
import { useTheme } from '@react-navigation/native';

export default function Screen(props) {
    // If you want extra styling, pass it through the screenStyle prop
    const { colors } = useTheme();

    if (props.scrollable) {
        return (
            <SafeAreaView style={{ ...styles.view_container, ...props.screenStyle, backgroundColor: colors.background }} {...props}>
                <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.scroll_view_container_style}>
                    {props.children}
                </ScrollView>
            </SafeAreaView>
        );
    } else {
        return (
            <SafeAreaView style={{ ...styles.view_container, ...props.screenStyle, backgroundColor: colors.background }} {...props}>
                {props.children}
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    view_container: {
        flex: 1,
        // alignItems: 'center',
        // justifyContent: 'center',
        // padding: 0,
        // width: '100%',
        // height: '100%'
    },

    scroll_view_container_style: {
        flexGrow: 1
        // flex: 1,
        // alignItems: 'center',
        // justifyContent: 'center',
        // padding: 0,
        // width: '100%',
    }
});