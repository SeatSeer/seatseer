import React from 'react';
import { Image, StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { loadAuthStack } from '../store/slices/authSlice';

export default function AccountDeleted() {
    const dispatch = useDispatch();

    function done() {
        dispatch(loadAuthStack());
    }

    return (<View style={styles.container}>
        <Image style={styles.image} source={require('../assets/logo-without-text.png')} />

        <Text style={styles.text_header}>
            Your account has been deleted.
        </Text>

        <Text style={styles.text_body}>
            Thank you for using SeatSeer!
        </Text>

        <TouchableOpacity style={styles.done_button} onPress={done}>
            <Text>Done</Text>
        </TouchableOpacity>
    </View>);
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

    done_button: {
        width: "80%",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
        backgroundColor: "#ff6961",
    }
});