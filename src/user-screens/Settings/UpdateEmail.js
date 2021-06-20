import React, { useState } from 'react';
import { Alert, Image, StyleSheet, View, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DismissKeyboard from '../../../misc_components/DismissKeyboard';
import Screen from '../../../misc_components/Screen';
import CustomText from '../../../misc_components/CustomText';
import { useSelector, useDispatch } from 'react-redux';
import { setOnUserEmailChanged } from '../../../api/auth';
import { changeCurrentUserEmail } from '../../../store/slices/authSlice';

export default function UpdateEmail() {
    const currentUserEmail = useSelector((state) => state.auth.currentUserEmail);
    const dispatch = useDispatch();
    const [newEmail, setNewEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    function handleUpdateEmail() {
        if (newEmail === currentUserEmail) {
            Alert.alert(
                "Invalid email",
                'Please enter a different email', 
                [{ text: "OK" }],
                { cancelable: true }
            );
        } else {
            setOnUserEmailChanged(
                currentUserEmail, password, newEmail,
                // onUserEmailChanged callback
                () => {
                    Alert.alert(
                        "Email updated",
                        'Your email was successfully updated. Please verify your account via the link sent to your new email to continue using SeatSeer.\nIf you did not want to change your email, we have sent a link to your previous email that can undo this action.', 
                        [{ text: "OK" }],
                        { cancelable: true }
                    );
                    dispatch(changeCurrentUserEmail(newEmail));
                },
                // onUserEmailFailedToChange
                (error) => {
                    let errorCode = error.code;
                    switch (errorCode) {
                        case 'auth/invalid-email': 
                            Alert.alert(
                                "Invalid email",
                                'Please enter a valid email.', 
                                [{ text: "OK" }],
                                { cancelable: true }
                            );
                            break;
                        case 'auth/email-already-in-use':
                            Alert.alert(
                                "Email already in use",
                                'The new email you have entered is already in use. Please enter an email that does not have a SeatSeer account.', 
                                [{ text: "OK" }],
                                { cancelable: true }
                            );
                            break;
                        case 'auth/wrong-password':
                            Alert.alert(
                                "Invalid password",
                                'The password you have entered is wrong. Please eeter the correct password to correctly identify yourself.', 
                                [{ text: "OK" }],
                                { cancelable: true }
                            );
                            break;
                        default: 
                            Alert.alert(
                                "Error",
                                'Oops, something went wrong!', 
                                [{ text: "OK" }],
                                { cancelable: true }
                            );
                    }
                }
            )
        }
    }

    return (
        <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={90}
        style={styles.container}
        contentContainerStyle={styles.content_container}>
            <DismissKeyboard>
                <Screen style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <Image style={styles.image} source={require('../../../assets/logo.png')} />

                    
                    <View style={styles.email_input_view}>
                        <CustomText text={"Enter your new email:"} textStyle={{alignSelf: 'flex-start'}} />
                        <TextInput
                            style={styles.text_input}
                            label="Enter your new email address"
                            autoCapitalize="none"
                            keyboardType="email-address"
                            placeholder="e.g. janedoenew@example.com"
                            placeholderTextColor="#003f5c"
                            onChangeText={setNewEmail}
                        />
                    </View>

                    <View>
                        <CustomText text={"Enter your password:"} textStyle={{alignSelf: 'flex-start'}} />
                        <View style={styles.password_input_view}>
                            <TextInput
                                style={styles.password_text_input}
                                label="Enter your password"
                                placeholderTextColor="#003f5c"
                                secureTextEntry={!isPasswordVisible}
                                onChangeText={setPassword}
                            />
                            <Ionicons name={isPasswordVisible ? "eye" : "eye-off"} size={20} color="gray" onPress={() => setIsPasswordVisible(!isPasswordVisible)} />
                        </View>
                    </View>

                    <TouchableOpacity style={styles.update_button} onPress={handleUpdateEmail}>
                        <CustomText text={"Update email"} />
                    </TouchableOpacity>
                </Screen>
            </DismissKeyboard>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    content_container: {
        alignItems: 'center',
        justifyContent: 'center',
    },

    image: {
        resizeMode: "contain",
        height: 175,
        width: 175,
        marginBottom: 20
    },

    email_input_view: {
        width: "80%",
        height: 45,
        marginBottom: 10,
        alignItems: "center",
        justifyContent: "center"
    },

    text_input: {
        backgroundColor: "#dbd6d2",
        height: 45,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "left",
        paddingLeft: '5%'
    },

    password_input_view: {
        flexDirection: "row",
        backgroundColor: "#dbd6d2",
        width: "80%",
        height: 45,
        alignItems: "center",
        justifyContent: 'space-evenly',
        paddingHorizontal: 10
    },

    password_text_input: {
        backgroundColor: "#dbd6d2",
        height: 45,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "left",
        paddingLeft: 10        
    },

    update_button: {
        width: "80%",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
        backgroundColor: "#46f583",
    },
})