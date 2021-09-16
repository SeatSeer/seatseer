import React, { useEffect } from 'react';
import Screen from '../misc_components/Screen';
import { ActivityIndicator, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setStateToLoggedIn, setStateToLoggedOut, setStateToEmailNotVerified } from '../store/slices/authSlice';
import { displayDarkTheme } from '../store/slices/themeSlice';
import { setNotificationsSettings, setExpoPushToken, setUnreadNotifs } from '../store/slices/notificationsSlice';
import Constants from 'expo-constants';
import {
    getPermissionsAsync,
    requestPermissionsAsync,
    getExpoPushTokenAsync,
    setNotificationChannelAsync,
    AndroidImportance,
 } from 'expo-notifications';
import { setOnAuthStateChanged, setOnUserEmailVerifiedChanged } from '../api/auth';
import { getDarkTheme, checkNotificationsSettings, checkUnreadNotifications , changeNotificationSetting, changeUnreadNotifications } from '../api/rtdb';
import { updateKafkaNotifications } from '../backend/Kafka';

async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
        const { status: existingStatus } = await getPermissionsAsync();
        if (existingStatus !== 'granted') {
            const { status: finalStatus } = await requestPermissionsAsync();
            if (finalStatus !== 'granted') {
                Alert.alert(
                    "Notifications denied",
                    "SeatSeer will not send you any notifications. You can always change this in your device settings.",
                    [
                        { text: "OK" }
                    ],
                    { cancelable: true }
                )
                return;
            }
        }
        token = (await getExpoPushTokenAsync()).data;
    } else {
        alert('Must use physical device for Push Notifications');
    }
  
    if (Platform.OS === 'android') {
        setNotificationChannelAsync('default', {
            name: 'default',
            importance: AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }
    return token;
}

export default function MainScreen() {
    const dispatch = useDispatch();
    const timeLimitHours = useSelector((state) => state.notifications.timeLimitHours);
    const timeLimitMinutes = useSelector((state) => state.notifications.timeLimitMinutes);
    const thresholdVacancy = useSelector((state) => state.notifications.thresholdVacancy);
    const groupedSeats = useSelector((state) => state.notifications.groupedSeats);
    const accountDeleted = useSelector((state) => state.auth.accountDeleted);

    useEffect(() => {
        return setOnAuthStateChanged(
            // onUserAuthenticated callback function
            (user) => {
                // Update the dark theme global state
                getDarkTheme(user.uid, 
                    (settings) => {
                        dispatch(displayDarkTheme(settings ? settings.darkTheme : false));
                    }, 
                    console.error
                );
                // Update the notifications settings state
                checkNotificationsSettings(user.uid,
                    (settings) => {
                        dispatch(setNotificationsSettings(settings));
                    }
                );
                checkUnreadNotifications(user.uid,
                    (unreadNotifs) => {
                        dispatch(setUnreadNotifs(unreadNotifs));
                    }
                )
                setOnUserEmailVerifiedChanged(
                    () => {
                        dispatch(setStateToLoggedIn({ displayName: user.displayName, email: user.email, userId: user.uid }));
                        // Check if the user has allowed the app to send them notifications
                        // If they have, update the expoPushToken global state
                        registerForPushNotificationsAsync().then(token => {
                            dispatch(setExpoPushToken(token));
                            changeNotificationSetting(user.uid, 'expoPushToken', token, () => {}, () => {});
                            updateKafkaNotifications(user.uid, token, timeLimitHours, timeLimitMinutes, thresholdVacancy, groupedSeats, () => {}, () => {});
                        });
                    },
                    () => {
                        dispatch(setStateToEmailNotVerified());
                    }
                )
                
            },
            // onUserNotFound callback function
            () => {
                dispatch(displayDarkTheme(false));
                dispatch(setStateToLoggedOut());
            }
        );
    }, []);

    return (
        <Screen screenStyle={{justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size="large" />
        </Screen>
    );
}