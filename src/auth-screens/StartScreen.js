import React from 'react';
import { Dimensions, Image, SafeAreaView, StyleSheet, Text } from 'react-native';
import { Button } from 'react-native-paper';

export default function StartScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.container}>
            <Image source={require('../../assets/logo-with-transparency.png')} style={styles.logo} />

            <Text style={{marginTop: 10, fontSize: 15, textAlign: 'center'}}>
                Wasting too much time finding seats?
            </Text>

            <Text style={{fontSize: 15, textAlign: 'center'}}>
                Don't worry, we've got you covered.
            </Text>

            <Button
                mode="contained"
                onPress={()=> navigation.navigate("SignUp")}
                color='#cfcdcc'
                uppercase={false}
                contentStyle={{width: 0.8 * width}}
                style={{marginTop: 20}}
            >Register</Button>

            <Button
                mode="contained"
                onPress={()=> navigation.navigate("Login")}
                color='#46f583'
                uppercase={false}
                contentStyle={{width: 0.8 * width}}
                style={{marginTop: 10}}
            >Login</Button>
        </SafeAreaView>
    )
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    logo: {
        resizeMode: 'contain',
        width: 0.8 * width,
        height: 0.8 * width
    },
});