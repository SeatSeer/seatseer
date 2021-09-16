import React from 'react';
import { Image, StyleSheet } from 'react-native';
import Screen from '../../misc_components/Screen';

export default function Home() {
    return (
        <Screen srollable>
            <Image source={require('../../assets/mock-home.png')} style={styles.image} />
            <Image source={require('../../assets/mock-home-2.png')} style={styles.image} />
        </Screen>
    );
}

const styles = StyleSheet.create({
    image: {
        resizeMode: "contain",
        alignSelf: 'center'
    }
})