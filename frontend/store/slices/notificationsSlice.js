import { createSlice } from '@reduxjs/toolkit';
import { changeNotificationSetting } from '../../api/rtdb';

export const notificationsSlice = createSlice({
    name: 'notifications',
    initialState: {
        expoPushToken: "",
        timeLimitHours: 0,
        timeLimitMinutes: 30,
        thresholdVacancy: 1,
        groupedSeats: false,
        unreadNotifications: 0
    },
    reducers: {
        setNotificationsSettings: (state, action) => {
            // payload will contain the user's current general notifications settings in firebase
            if (action.payload) {
                state.timeLimitHours = action.payload.timeLimitHours;
                state.timeLimitMinutes = action.payload.timeLimitMinutes;
                state.thresholdVacancy = action.payload.thresholdVacancy;
                state.groupedSeats = action.payload.groupedSeats;
            }
        },
        updateNotificationsSettings: (state, action) => {
            // payload will contain the current userId and the setting to be updated
            changeNotificationSetting(action.payload.currentUserId, action.payload.notificationSetting, action.payload.value,
                () => {},
                console.log
            );
            state[action.payload.notificationSetting] = action.payload.value;
        },
        setExpoPushToken: (state, action) => {
            state.expoPushToken = action.payload;
        },
        setUnreadNotifs: (state, action) => {
            state.unreadNotifications = action.payload;
        },
        incrementUnreadNotifs: (state, action) => {
            state.unreadNotifications = state.unreadNotifications + 1;
        },
        decrementUnreadNotifs: (state, action) => {
            state.decrementUnreadNotifs = state.unreadNotifications - 1;
        }
    }
});

export const { setNotificationsSettings, updateNotificationsSettings, setExpoPushToken, setUnreadNotifs, incrementUnreadNotifs, decrementUnreadNotifs } = notificationsSlice.actions;

export default notificationsSlice.reducer;