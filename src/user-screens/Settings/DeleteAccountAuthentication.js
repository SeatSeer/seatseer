import React, { useState } from 'react';
import { Alert, StyleSheet, View, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DismissKeyboard from '../../../misc_components/DismissKeyboard';
import Screen from '../../../misc_components/Screen';
import CustomText from '../../../misc_components/CustomText';
import { useDispatch, useSelector } from 'react-redux';
import { reauthenticateUser, deleteCurrentUser } from '../../../api/auth';
import { loadAccountDeleted } from '../../../store/slices/authSlice';

export default function DeleteAccountAuthentication() {
    const currentUserEmail = useSelector((state) => state.auth.currentUserEmail);
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const dispatch = useDispatch();

    function handleDeleteAccount() {
        reauthenticateUser(currentUserEmail, password,
            // onSuccessfulReauthentication callback
            () => {
                Alert.alert(
                    "WARNING",
                    'If you delete your account, you will lose all your preferences and history. Do you want to proceed?',
                    [
                        {
                            text: "Yes",
                            onPress: () => {
                                deleteCurrentUser(
                                    // onSuccessfulDeletion callback
                                    () => {
                                        // navigate to thank you page
                                        dispatch(loadAccountDeleted());
                                    },
                                    // onFailedDeletion callback
                                    (error) => {
                                        Alert.alert(
                                            "Error",
                                            'Oops, something went wrong!', 
                                            [{ text: "OK" }],
                                            { cancelable: true }
                                        );
                                    }
                                );
                            }
                        },
                        {
                            text: "No"
                        }
                        
                    ],
                    { cancelable: true }
                );
            },
            // onFailedReauthentication callback
            (error) => {
                let errorCode = error.code;
                switch (errorCode) {
                    case 'auth/wrong-password': 
                        Alert.alert(
                            "Invalid password",
                            'The password you have entered is wrong. Please enter the right password to correctly identify yourself.', 
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
                        break;
                }
            }
        );
    }

    return (
        <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={50}
        style={styles.container}
        contentContainerStyle={styles.content_container}>
            <DismissKeyboard>
                <Screen style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    
                    <View>
                        <CustomText text={"Enter your password:"} textStyle={{textAlign: 'left'}} />
                        
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

                    <TouchableOpacity style={styles.delete_button} onPress={handleDeleteAccount}>
                        <CustomText text={"Delete Account"} />
                    </TouchableOpacity>
                </Screen>
            </DismissKeyboard>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    content_container: {
        alignItems: 'center',
        justifyContent: 'center',
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

    delete_button: {
        width: "80%",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
        backgroundColor: "#46f583",
    },
})