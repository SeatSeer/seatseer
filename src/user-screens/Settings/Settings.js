import React from 'react';
import { Alert, StyleSheet, Image, TouchableOpacity, View, Dimensions } from 'react-native';
import { Button } from 'react-native-paper';
import SwitchToggle from "react-native-switch-toggle";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import Screen from '../../../misc_components/Screen';
import CustomText from '../../../misc_components/CustomText';
import { useDispatch } from 'react-redux';
import { setStateToIsLoading } from '../../../store/slices/authSlice';
import { toggleDarkTheme } from '../../../store/slices/themeSlice';
import { useTheme } from '@react-navigation/native';
import { logOut, setOnPasswordReset } from '../../../api/auth';

export default function Settings({ navigation }) {
    const theme = useTheme();
    const currentUserDisplayName = useSelector((state) => state.auth.currentUserDisplayName);
    const currentUserEmail = useSelector((state) => state.auth.currentUserEmail);
    const currentUserId = useSelector((state) => state.auth.currentUserId);
    const dispatch = useDispatch();

    // Array containing the details of all settings options
    const settingsOptions = [
        {
            title: "Account",
            options: [
                {
                    subtitle: "Reset password",
                    onPress: () => {
                        Alert.alert(
                            "Reset Password",
                            "Would you like to reset your password?",
                            [
                                {
                                    text: "OK",
                                    onPress: handleResetPassword
                                },
                                {
                                    text: "Cancel",
                                }
                            ],
                            { cancelable: true }
                        )
                    }
                },
                {
                    subtitle: "Update email",
                    onPress: () => {
                        navigation.navigate("UpdateEmail");
                    }
                },
                {
                    subtitle: "Delete account",
                    onPress: () => {
                        navigation.navigate("DeleteAccountAuthentication");
                    }
                },
            ]
        },
        {
            title: "Appearance",
            options: [
                {
                    subtitle: "Dark mode",
                    onPress: () => {
                        dispatch(toggleDarkTheme(currentUserId));
                    },
                    type: "Switch"
                }
            ]
        },
        // {
        //     title: "Help",
        //     options: [
        //         {
        //             subtitle: "Tutorial",
        //             onPress: () => {
        //                 navigation.navigate("Tutorial");
        //             }
        //         }
        //     ]
        // },
        {
            title: "Support",
            options: [
                {
                    subtitle: "Feedback",
                    onPress: () => {
                        /** @todo Open up browser to feedback form website. */
                        navigation.navigate("Feedback");
                    }
                },
                {
                    subtitle: "Report a faulty seat",
                    onPress: () => {
                        /** @todo Open up browser to report faulty seat form website. */
                        navigation.navigate("ReportFaultySeat");
                    }
                }
            ]
        }
    ];

    function handleResetPassword() {
        setOnPasswordReset(
            currentUserEmail,
            // onSuccessfulResetPasswordEmailSent callback function
            () => {
                navigation.navigate("ChangePassword");
            },
            // onPasswordEmailFailedToSend callback function
            (error) => {
                let errorCode = error.code;
                let errorMessage = error.message;
                if (errorCode == 'auth/invalid-email') {
                    Alert.alert(
                      "Invalid email",
                      'Please enter a valid email.', 
                      [{
                        text: "OK"
                      }],
                      { cancelable: true }
                    )
                } else if (errorCode == 'auth/user-not-found') {
                    Alert.alert(
                      "User not found",
                      `The email you have entered is not registered.`,
                      [{
                        text: "OK"
                      }],
                      { cancelable: true }
                    )
                }
            }
        );
    }

    function handleLogout() {
        logOut(
            // onSuccess callback function
            () => dispatch(setStateToIsLoading()),
            // onError callback function
            console.error
        );
    }
    
    return (
        <Screen scrollable={true}>
            {/* User Profile Picture and Display Name */}
            <View style={{backgroundColor: theme.colors.settings, ...styles.image_view_container}}>
                <Image style={styles.profile_pic} source={require('../../../assets/logo-without-text.png')} />
                <CustomText text={currentUserDisplayName} textStyle={{alignSelf: 'center', fontSize: 23, fontWeight: 'bold', paddingBottom: 10}} />
            </View>

            {
                settingsOptions.map(({ title, options }) => (
                    <View key={title}>
                        <CustomText text={title} textStyle={styles.title} />
                        <View style={{height: 0.5, backgroundColor: 'grey'}} />
                        {
                            options.map(({ subtitle, onPress, type }) => {
                                if (type === "Switch") {
                                    return (<View key={subtitle} style={{backgroundColor: theme.colors.settings, ...styles.settings_option}}>
                                        <CustomText text={subtitle} textStyle={styles.subtitle} />
                                        <SwitchToggle
                                            containerStyle={styles.containerStyle}
                                            circleStyle={styles.circleStyle}
                                            backgroundColorOn="#53d769"
                                            backgroundColorOff="#a9a9a9"
                                            switchOn={theme.dark}
                                            onPress={onPress}
                                            circleColorOff="white"
                                            circleColorOn="white"
                                        />
                                    </View>);
                                } else {
                                    return (<TouchableOpacity key={subtitle} style={{backgroundColor: theme.colors.settings, ...styles.settings_option}} onPress={onPress}>
                                        <CustomText text={subtitle} textStyle={styles.subtitle} />
                                        <Ionicons name="chevron-forward" size={25} color="darkgrey" />
                                    </TouchableOpacity>);
                                }
                            })
                        }
                    </View>
                ))
            }

            <Button
                mode="contained"
                onPress={handleLogout}
                color='#ff6961'
                uppercase={false}
                style={{marginTop: 10, width: '80%', alignSelf: 'center', marginTop: 20}}
            >Log out</Button>

            <CustomText text={"Powered by:"} textStyle={{paddingTop: 30, alignSelf: 'center'}} />

            <Screen screenStyle={styles.icons_view_container}>
                <Image style={styles.image} source={require('../../../assets/react-native.png')} resizeMode={'contain'} style={styles.icons} />
                <Image style={styles.image} source={require('../../../assets/firebase.png')} resizeMode={'contain'} style={styles.icons} />
                <Image style={styles.image} source={require('../../../assets/expo.png')} resizeMode={'contain'} style={styles.icons} />
                <Image style={styles.image} source={require('../../../assets/mongodb.png')} resizeMode={'contain'} style={styles.icons} />
                {
                    theme.dark
                        ? <Image style={styles.image} source={require('../../../assets/kafka-night-mode.png')} resizeMode={'contain'} style={styles.icons} />
                        : <Image style={styles.image} source={require('../../../assets/kafka.png')} resizeMode={'contain'} style={styles.icons} />
                }
            </Screen>
        </Screen>
    );
}

const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
    image_view_container: {
        borderTopColor: 'grey',
        borderBottomColor: 'grey',
        borderTopWidth: 0.5,
        borderBottomWidth: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
    },

    profile_pic: {
        alignSelf: 'center',
        resizeMode: "contain",
        width: 0.3 * width,
        height: 0.3 * width,
        borderRadius: 0.3 * width / 2,
        marginTop: 10
    },

    settings_option: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: '3%',
        borderBottomColor: 'grey',
        borderBottomWidth: 0.5
    },

    title: {
        fontSize: 17,
        paddingTop: '5%',
        paddingBottom: '3%',
        paddingHorizontal: '3%'
    },

    subtitle: {
        fontSize: 17,
        padding: 12
    },

    containerStyle : {
        width: 45,
        height: 25,
        borderRadius: 25,
        borderColor: `#000000`,
        backgroundColor: '#0000ff',
        padding: 2
    },
    
    circleStyle : {
        width: 20,
        height: 20,
        borderRadius: 19,
        borderColor: `#000000`,
        backgroundColor: '#ffffff'
    },

    logout_button: {
        width: "80%",
        height: 50,
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
        backgroundColor: "#ff6961",
    },

    icons_view_container: {
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },

    icons: {
        resizeMode: "contain",
        width: 0.15 * width,
        height: 0.15 * width,
    }
})