import React from 'react';
import { Image, StyleSheet } from 'react-native';
import Screen from '../../misc_components/Screen';
import CustomText from '../../misc_components/CustomText';
import { useSelector } from 'react-redux';

export default function Home() {
    const currentUserDisplayName = useSelector((state) => state.auth.currentUserDisplayName);
    return (
        <Screen>
            <CustomText text={`Welcome home, ${currentUserDisplayName}`} textStyle={{fontSize: 30, fontWeight: 'bold', paddingVertical: 20}} />
            <Image source={require('../../assets/logo-without-text-with-transparency.png')} style={styles.image} />
        </Screen>
    );
}

const styles = StyleSheet.create({
    image: {
        resizeMode: "contain",
        height: 175,
        width: 175,
        marginBottom: 20,
        alignSelf: 'center'
    }
})