import React, { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { CommonActions } from "@react-navigation/native";
import { setOnUserEmailVerifiedChanged } from '../../api/auth';

export default function VerifyEmailScreen({ navigation }) {
    const [tellUserToVerifyEmail, setTellUserToVerifyEmail] = useState(false);

    function handleVerify() {
        setOnUserEmailVerifiedChanged(
            // onUserEmailVerified callback function
            () => {
                setTellUserToVerifyEmail(false);
                navigation.dispatch(CommonActions.reset({
                    index: 0,
                    routes: [{ name: "MainTabs" }]
                }));
            },
            // onUserEmailNotVerified callback function
            () => setTellUserToVerifyEmail(true)
        );
    }

    return (
        <View style={styles.container}>
            <Image style={styles.image} source={require('../../assets/logo-without-text.png')} />

            <Text style={styles.text_header}>
                A verification link has been sent to your email account.
            </Text>

            <Text style={styles.text_body}>
                Please click on the link sent to your email account to finish your registration and start using SeatSeer.
            </Text>

            <Text style={styles.text_body}>
                After verifying your email, click the button below to start using SeatSeer!
            </Text>

            {tellUserToVerifyEmail &&
            <Text style={styles.error_message}>
                Please verify your email before proceeding!
            </Text>}

            <TouchableOpacity style={styles.start_using_button} onPress={handleVerify}>
                <Text style={styles.login_text}>Start using SeatSeer!</Text>
            </TouchableOpacity>
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

    image: {
        resizeMode: "contain",
        height: 200,
        width: 200,
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

    start_using_button: {
        width: "80%",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#46f583",
    },

    error_message: {
        color: 'red',
        fontSize: 10,
        textAlign: 'left'
    }
});