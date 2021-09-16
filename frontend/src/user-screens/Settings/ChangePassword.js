import React from 'react';
import { Image, StyleSheet } from 'react-native';
import Screen from '../../../misc_components/Screen';
import CustomText from '../../../misc_components/CustomText';
import { useSelector } from 'react-redux';

export default function ChangePassword() {
    const currentUserEmail = useSelector((state) =>state.auth.currentUserEmail);

    return (
        <Screen screenStyle={styles.container}>
            <Image style={styles.image} source={require('../../../assets/logo-without-text-with-transparency.png')} />
            <CustomText text={`A password reset email has been sent to your email address ${currentUserEmail}`} textStyle={{textAlign: 'center'}} />
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },

    image: {
        resizeMode: "contain",
        height: 200,
        width: 200,
        marginBottom: 20
    }
})