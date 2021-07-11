import React, { useEffect, useRef, useState } from 'react';
import { Alert, Image, StyleSheet, View, Text, TextInput, Dimensions } from 'react-native';
import { Button } from 'react-native-paper';
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
    const [passwordFieldError, setPasswordFieldError] = useState(null);
    const passwordTextInput = useRef();
    const dispatch = useDispatch();

    useEffect(() => {
        passwordTextInput.current.focus();
    }, []);

    function handleDeleteAccount() {
        setPasswordFieldError(null);
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
                        setPasswordFieldError('Invalid password.');
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
        <DismissKeyboard>
            <Screen screenStyle={styles.container}>
                <Image source={require('../../../assets/logo-without-text-with-transparency.png')} style={styles.image} />
                <CustomText text={"We're sad to see you go."} textStyle={{fontWeight: 'bold', fontSize: 25}} />
                <View style={{marginTop: 10, width: '80%', alignItems: 'center'}}>
                    <CustomText text={"Enter your password (just to make sure it's you):"} textStyle={{alignSelf: 'flex-start', fontSize: 12, marginBottom: 2}} />
                    <View style={{...styles.password_input_view, borderWidth: passwordFieldError ? 1 : 0, borderColor: 'red'}}>
                        <TextInput
                            ref={passwordTextInput}
                            style={styles.password_text_input}
                            autoCapitalize="none"
                            returnKeyType="go"
                            placeholder="Password"
                            placeholderTextColor="#003f5c"
                            secureTextEntry={!isPasswordVisible}
                            onChangeText={setPassword}
                            onSubmitEditing={handleDeleteAccount}
                        />
                        <Ionicons name={isPasswordVisible ? "eye-off" : "eye"} size={20} color="gray" onPress={() => setIsPasswordVisible(!isPasswordVisible)} style={{flex: 1}} />
                    </View>
                    {
                        passwordFieldError
                            ? <Text style={{alignSelf: 'flex-start', color: 'red', fontSize: 10, marginBottom: 10}}>{passwordFieldError}</Text>
                            : <></>
                    }
                    </View>

                    <Button
                        mode="contained"
                        onPress={handleDeleteAccount}
                        color='#46f583'
                        uppercase={false}
                        style={{marginTop: 10, width: '80%'}}
                    >Delete account</Button>
            </Screen>
        </DismissKeyboard>
    );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'flex-start'
    },

    image: {
        resizeMode: 'contain',
        width: 0.35 * width,
        height: 0.35 * width
    },

    password_input_view: {
        flexDirection: "row",
        backgroundColor: "#dbd6d2",
        borderRadius: 5,
        width: "100%",
        height: 45,
        alignItems: "center",
        justifyContent: "space-evenly",
    },

    password_text_input: {
        flex: 9,
        height: 45,
        alignItems: "center",
        justifyContent: "center",
        textAlign: "left",
        paddingHorizontal: 10
    },
})