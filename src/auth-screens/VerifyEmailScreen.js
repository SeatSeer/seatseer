import React, { useState } from 'react';
import { Image, StyleSheet, Text, SafeAreaView, Dimensions } from 'react-native';
import Screen from '../../misc_components/Screen';
import CustomText from '../../misc_components/CustomText';
import { Button } from 'react-native-paper';
import { setOnUserEmailVerifiedChanged, logOut } from '../../api/auth';
import { setStateToIsLoading } from '../../store/slices/authSlice';
import { useDispatch } from 'react-redux';

export default function VerifyEmailScreen() {
    const [tellUserToVerifyEmail, setTellUserToVerifyEmail] = useState(false);

    const dispatch = useDispatch();

    function handleVerify() {
        setOnUserEmailVerifiedChanged(
            // onUserEmailVerified callback function
            (user) => {
                setTellUserToVerifyEmail(false);
                dispatch(setStateToIsLoading());
            },
            // onUserEmailNotVerified callback function
            () => setTellUserToVerifyEmail(true)
        );
    }

    function handleLogOut() {
        logOut(
            // onSuccess callback function
            () => dispatch(setStateToIsLoading()),
            // onError callback function
            console.error
        );
    }

    return (
        <Screen screenStyle={styles.container}>
            <Image style={styles.image} source={require('../../assets/logo-without-text.png')} />

            <CustomText text="A verification link has been sent to your email account." textStyle={styles.text_header} />

            <CustomText text="Please click on the link sent to your email account to finish your registration and start using SeatSeer." textStyle={styles.text_body} />

            <CustomText text="After verifying your email, click the button below to start using SeatSeer!" textStyle={styles.text_body} />

            {tellUserToVerifyEmail && <CustomText text="Please verify your email before proceeding!" textStyle={styles.error_message} />}

            <Button
                mode="contained"
                onPress={handleVerify}
                color='#46f583'
                uppercase={false}
                contentStyle={{width: 0.8 * width}}
            >Start using SeatSeer!</Button>

            <Button
                mode="contained"
                onPress={handleLogOut}
                color='#ff6961'
                uppercase={false}
                contentStyle={{width: 0.8 * width}}
                style={{marginTop: 20}}
            >Log Out</Button>
        </Screen>
    );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    image: {
        resizeMode: "contain",
        height: 0.5 * width,
        width: 0.5 * width,
        marginBottom: 20
    },

    text_header: {
        fontWeight: 'bold',
        fontSize: 20,
        color: '#000000',
        marginBottom: 20,
        textAlign: 'center'
    },

    text_body: {
        fontSize: 15,
        color:'#5d5d5d',
        textAlign: 'center',
        marginBottom: 20,
    },

    error_message: {
        color: 'red',
        fontSize: 10,
        textAlign: 'left'
    },
});