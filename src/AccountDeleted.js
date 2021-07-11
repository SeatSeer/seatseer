import React from 'react';
import { Image, SafeAreaView, StyleSheet, Text, Dimensions } from 'react-native';
import { Button } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { loadAuthStack } from '../store/slices/authSlice';

export default function AccountDeleted() {
    const dispatch = useDispatch();

    function done() {
        dispatch(loadAuthStack());
    }

    return (
        <SafeAreaView style={styles.container}>
            <Image style={styles.image} source={require('../assets/logo-without-text-with-transparency.png')} />

            <Text style={styles.text_header}>
                Your account has been deleted.
            </Text>

            <Text style={styles.text_body}>
                Thank you for using SeatSeer!
            </Text>

            <Button
                mode="contained"
                onPress={done}
                color='#46f583'
                uppercase={false}
                style={{marginTop: 10, width: '80%'}}
            >Done</Button>
        </SafeAreaView>
    );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    image: {
        resizeMode: "contain",
        height: 0.7 * width,
        width: 0.7 * width,
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
});