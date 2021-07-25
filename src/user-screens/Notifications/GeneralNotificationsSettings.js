import React, { useLayoutEffect, useEffect, useState } from 'react';
import { Alert, View, StyleSheet } from 'react-native';
import Screen from '../../../misc_components/Screen';
import CustomText from '../../../misc_components/CustomText';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '@react-navigation/native';
import { HeaderBackButton } from '@react-navigation/stack';
import RNPickerSelect from 'react-native-picker-select';
import SwitchToggle from 'react-native-switch-toggle';
import { hours, minutes, seatThresholds } from '../../../constants/pickerItems';
import { updateNotificationsSettings } from '../../../store/slices/notificationsSlice';
import { updateKafkaNotifications } from '../../../backend/Kafka';

export default function GeneralNotificationsSettings({ navigation }) {
    const currentUserId = useSelector((state) => state.auth.currentUserId);
    const expoPushToken = useSelector((state) => state.notifications.expoPushToken);
    const timeLimitHours = useSelector((state) => state.notifications.timeLimitHours);
    const timeLimitMinutes = useSelector((state) => state.notifications.timeLimitMinutes);
    const thresholdVacancy = useSelector((state) => state.notifications.thresholdVacancy);
    const groupedSeats = useSelector((state) => state.notifications.groupedSeats);
    const [newTimeLimitHours, setNewTimeLimitHours] = useState(timeLimitHours);
    const [newTimeLimitMinutes, setNewTimeLimitMinutes] = useState(timeLimitMinutes);
    const [newThresholdVacancy, setNewThresholdVacancy] = useState(thresholdVacancy);
    const [newGroupedSeats, setNewGroupedSeats] = useState(groupedSeats);
    const { colors } = useTheme();
    const dispatch = useDispatch();

    useEffect(() => {
        return navigation.addListener('beforeRemove', (e) => {
            if (newTimeLimitHours === timeLimitHours && newTimeLimitMinutes === timeLimitMinutes
                && newThresholdVacancy === thresholdVacancy && newGroupedSeats === groupedSeats) {
                    // If there are no unsaved changes, safe to leave the screen
                    return;
            } else {
                // Prevent default behavior of leaving the screen
                e.preventDefault();
                // Prompt the user before leaving the screen
                Alert.alert(
                    "You have unsaved changes",
                    "Would you like to save the changes made to your notification settings?",
                    [
                        {
                            text: "Yes",
                            onPress: () => {
                                if (newTimeLimitHours !== timeLimitHours) {
                                    dispatch(updateNotificationsSettings({ currentUserId, notificationSetting: 'timeLimitHours', value: newTimeLimitHours }));
                                }
                                if (newTimeLimitMinutes !== timeLimitMinutes) {
                                    dispatch(updateNotificationsSettings({ currentUserId, notificationSetting: 'timeLimitMinutes', value: newTimeLimitMinutes }));
                                }
                                if (newThresholdVacancy !== thresholdVacancy) {
                                    dispatch(updateNotificationsSettings({ currentUserId, notificationSetting: 'thresholdVacancy', value: newThresholdVacancy }));
                                }
                                if (newGroupedSeats !== groupedSeats) {
                                    dispatch(updateNotificationsSettings({ currentUserId, notificationSetting: 'groupedSeats', value: newGroupedSeats }));
                                }
                                updateKafkaNotifications(currentUserId, expoPushToken, newTimeLimitHours, newTimeLimitMinutes, newThresholdVacancy, newGroupedSeats,
                                    () => {},
                                    () => {}
                                );
                                navigation.dispatch(e.data.action);
                            }
                        },
                        { text: "No", style: 'destructive', onPress: () => navigation.dispatch(e.data.action) },
                        { text: "Cancel", style: 'cancel' }
                    ],
                    { cancelable: true }
                )

            }
        })
    }, [navigation, newTimeLimitHours, newTimeLimitMinutes, newThresholdVacancy, newGroupedSeats]);

    return (
        <Screen scrollable>
            <View style={{flexDirection: 'row', width: '100%'}}>
                <View style={{width: '60%', padding: 5}}>
                    <CustomText text="Time Limit" textStyle={{ fontWeight: 'bold', fontSize: 17, marginBottom: 5 }} />
                    <CustomText text="Set the time period you want to receive notifications from the moment you press the bell icon" />
                </View>
                
                <View style={{width: '40%', justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                        <RNPickerSelect
                            placeholder={{}}
                            items={hours}
                            onValueChange={(value, index) => {
                                // dispatch(updateNotificationsSettings({ currentUserId, notificationSetting: 'timeLimitHours', value }));
                                setNewTimeLimitHours(value);
                            }}
                            value={newTimeLimitHours}
                            useNativeAndroidPickerStyle={false}
                            style={{
                                inputIOS: { ...pickerSelectStyles.inputIOS, color: colors.text },
                                inputAndroid: { ...pickerSelectStyles.inputAndroid, color: colors.text },
                                viewContainer: { ...pickerSelectStyles.viewContainer, backgroundColor: colors.border },
                                inputAndroidContainer: { ...pickerSelectStyles.inputAndroidContainer, backgroundColor: colors.border }
                            }}
                        />
                        <CustomText text="hrs" textStyle={{paddingHorizontal: 2}} />
                        <RNPickerSelect
                            placeholder={{}}
                            items={minutes}
                            onValueChange={(value, index) => {
                                // dispatch(updateNotificationsSettings({ currentUserId, notificationSetting: 'timeLimitMinutes', value }));
                                setNewTimeLimitMinutes(value);
                            }}
                            value={newTimeLimitMinutes}
                            useNativeAndroidPickerStyle={false}
                            style={{
                                inputIOS: { ...pickerSelectStyles.inputIOS, color: colors.text },
                                inputAndroid: { ...pickerSelectStyles.inputAndroid, color: colors.text },
                                viewContainer: { ...pickerSelectStyles.viewContainer, backgroundColor: colors.border },
                                inputAndroidContainer: { ...pickerSelectStyles.inputAndroidContainer, backgroundColor: colors.border }
                            }}
                        />
                        <CustomText text="mins" textStyle={{paddingHorizontal: 2}} />
                    </View>
                </View>
            </View>
            
            <View style={{height: 0.5, backgroundColor: 'grey', width: '100%'}} />

            <View style={{flexDirection: 'row', width: '100%'}}>
                <View style={{width: '60%', padding: 5}}>
                    <CustomText text="Threshold Vacancy" textStyle={{ fontWeight: 'bold', fontSize: 17, marginBottom: 5 }} />
                    <CustomText text="Set the maximum number of seats needed to be vacant at a location before SeatSeer can notify you" />
                </View>

                <View style={{width: '40%', justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                        <RNPickerSelect
                            placeholder={{}}
                            items={seatThresholds}
                            onValueChange={(value, index) => {
                                // dispatch(updateNotificationsSettings({ currentUserId, notificationSetting: 'thresholdVacancy', value }));
                                setNewThresholdVacancy(value);
                            }}
                            value={newThresholdVacancy}
                            useNativeAndroidPickerStyle={false}
                            style={{
                                inputIOS: { ...pickerSelectStyles.inputIOS, color: colors.text },
                                inputAndroid: { ...pickerSelectStyles.inputAndroid, color: colors.text },
                                viewContainer: { ...pickerSelectStyles.viewContainer, backgroundColor: colors.border },
                                inputAndroidContainer: { ...pickerSelectStyles.inputAndroidContainer, backgroundColor: colors.border }
                            }}
                        />
                        <CustomText text={newThresholdVacancy === 1 ? "seat" : "seats"} textStyle={{paddingHorizontal: 2}} />
                    </View>
                </View>
            </View>

            <View style={{height: 0.5, backgroundColor: 'grey', width: '100%'}} />

            <View style={{flexDirection: 'row', width: '100%', opacity: newThresholdVacancy === 1 ? 0.3 : 1}}>
                <View style={{width: '65%', padding: 5}}>
                    <CustomText text="Grouped Seats" textStyle={{ fontWeight: 'bold', fontSize: 17, marginBottom: 5 }} />
                    <CustomText text="If your Threshold Vacancy is more than 1 seat,
                        enabling this option will force SeatSeer to notify you only when seats that are grouped together become vacant." />
                </View>

                <View style={{width: '35%', justifyContent: 'center', alignItems: 'center'}}>
                    <SwitchToggle
                        containerStyle={{width: 45,
                            height: 25,
                            borderRadius: 25,
                            borderColor: `#000000`,
                            backgroundColor: '#0000ff',
                            padding: 2
                        }}
                        circleStyle={{width: 20,
                            height: 20,
                            borderRadius: 19,
                            borderColor: `#000000`,
                            backgroundColor: '#ffffff'
                        }}
                        backgroundColorOn="#53d769"
                        backgroundColorOff="#a9a9a9"
                        switchOn={newGroupedSeats}
                        circleColorOff="white"
                        circleColorOn="white"
                        disabled={newThresholdVacancy === 1}
                        onPress={() => {
                            // dispatch(updateNotificationsSettings({ currentUserId, notificationSetting: 'groupedSeats', value: !groupedSeats }));
                            setNewGroupedSeats(!newGroupedSeats);
                        }}
                    />
                </View>
            </View>

            <View style={{height: 0.5, backgroundColor: 'grey', width: '100%'}} />
        </Screen>
    );
}

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        padding: 8,
        textAlign: 'center'
    },

    inputAndroid: {
        fontSize: 16,
        padding: 8,
        textAlign: 'center'
    },

    viewContainer: {
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'grey'
    },

    inputAndroidContainer: {
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'grey'
    }
});