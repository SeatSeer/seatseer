import firebaseApp from "./firebase";
import firebase from "firebase/app";
import "firebase/database";

const db = firebaseApp.database();

export const addFavourite = async (userId, locationName, locationId, onSuccess, onError) => {
    try {
        const favourite = db.ref(`favourites/${userId}`).child(`${locationId}`);
        await favourite.set(locationName);
        // favourite has a .key field where the locationId object is stored
        return onSuccess(favourite);
    } catch (error) {
        return onError(error);
    }
}

export const removeFavourite = async (userId, locationId, onSuccess, onError) => {
    try {
        await db.ref(`favourites/${userId}/${locationId}`).remove();
        return onSuccess();
    } catch (error) {
        return onError(error);
    }
}

export const subscribeToFavouritesChanges = (userId, onValueChanged) => {
    const favourites = db.ref(`favourites/${userId}`);
    favourites.on("value", (dataSnapshot) => onValueChanged(dataSnapshot.val()));
    return () => favourites.off("value");
}

export const checkFavourite = async (userId, locationId, onSuccess, onError) => {
    try {
        const favouritesSnapshot = await db.ref(`favourites/${userId}`).get();
        const favourite = favouritesSnapshot.child(`${locationId}`).exists();
        return onSuccess(favourite);
    } catch (error) {
        return onError(error);
    }
}

export const addFeedback = async (userId, feedbackText, onSuccess, onError) => {
    try {
        const userFeedback = db.ref(`feedback/${userId}`).push();
        await userFeedback.set(feedbackText);
        return onSuccess(userFeedback);
    } catch (error) {
        return onError(error);
    }
}

export const addReport = async (userId, location, seatNumber, details, onSuccess, onError) => {
    try {
        const userReports = db.ref(`faultReports/${userId}`).push();
        await userReports.set({ location, seatNumber, details });
        return onSuccess(userReports);
    } catch (error) {
        return onError(error);
    }
}

export const initializeDarkTheme = async (userId, onSuccess, onError) => {
    try {
        const userSettings = db.ref(`settings`).child(userId);
        await userSettings.set({darkTheme: false});
        return onSuccess(userSettings);
    } catch (error) {
        return onError(error);
    }
}

export const getDarkTheme = async (userId, onSuccess, onError) => {
    try {
        const settingsSnapshot = await db.ref(`settings/${userId}`).get();
        return onSuccess(settingsSnapshot.val());
    } catch (error) {
        onError(error);
    }
}

export const setDarkTheme = async (userId, darkTheme, onSuccess, onError) => {
    try {
        const userSettings = db.ref(`settings`).child(userId);
        await userSettings.set({darkTheme: darkTheme});
        return onSuccess(userSettings);
    } catch (error) {
        return onError(error);
    }
}

export const deleteAllUserData = async (userId, onSuccess, onError) => {
    try {
        await db.ref(`favourites/${userId}`).remove();
        await db.ref(`settings/${userId}`).remove();
        await db.ref(`notifications/${userId}`).remove();
        return onSuccess();
    } catch (error) {
        return onError(error);
    }
}

export const addNotification = async (userId, deleteTime, locationId, onSuccess, onError) => {
    try {
        const location = db.ref(`notifications/${userId}`).child(`locations/${locationId}`);
        await location.set(deleteTime);
        // notification has a .key field where the locationId object is stored
        return onSuccess(location);
    } catch (error) {
        return onError(error);
    }
}

export const removeNotification = async (userId, locationId, onSuccess, onError) => {
    try {
        await db.ref(`notifications/${userId}/locations/${locationId}`).remove();
        return onSuccess();
    } catch (error) {
        return onError(error);
    }
}

export const subscribeToNotificationsChanges = (userId, onValueChanged) => {
    const locations = db.ref(`notifications/${userId}/locations`);
    locations.on("value", (dataSnapshot) => onValueChanged(dataSnapshot.val()));
    return () => locations.off("value");
}

export const checkNotification = async (userId, locationId, onSuccess, onError) => {
    try {
        const notificationsSnapshot = await db.ref(`notifications/${userId}`).get();
        const location = notificationsSnapshot.child(`locations/${locationId}`).exists();
        return onSuccess(location);
    } catch (error) {
        return onError(error);
    }
}

export const initializeNotifications = async (userId, onSuccess, onError) => {
    try {
        const userNotificationsSettings = db.ref(`notifications`).child(`${userId}/notificationsSettings`);
        await userNotificationsSettings.set({
            expoPushToken: "",
            timeLimitHours: 0,
            timeLimitMinutes: 30,
            thresholdVacancy: 1,
            groupedSeats: false
        });
        const unreadNotifications = db.ref(`notifications`).child(`${userId}/unreadNotifications`);
        await unreadNotifications.set(0);
        return onSuccess(userNotificationsSettings);
    } catch (error) {
        return onError(error);
    }
}

export const checkUnreadNotifications = async (userId, onSuccess, onError) => {
    try {
        const unreadNotificationsSnapshot = await db.ref(`notifications/${userId}/unreadNotifications`).get();
        const unreadNotifications = unreadNotificationsSnapshot.val();
        return onSuccess(unreadNotifications);
    } catch (error) {
        return onError(error);
    }
}

export const changeUnreadNotifications = async (userId, newValue, onSuccess, onError) => {
    try {
        const unreadNotifications = db.ref(`notifications/${userId}/unreadNotifications`);
        await unreadNotifications.set(newValue);
        const unreadNotificationsSnapshot = await unreadNotifications.get();
        return onSuccess(unreadNotificationsSnapshot.val());
    } catch (error) {
        return onError(error);
    }
}

export const checkNotificationsSettings = async (userId, onSuccess, onError) => {
    try {
        const notificationsSettingsSnapshot = await db.ref(`notifications/${userId}/notificationsSettings`).get();
        const notificationsSettings = notificationsSettingsSnapshot.val();
        return onSuccess(notificationsSettings);
    } catch (error) {
        return onError(error);
    }
}

export const changeNotificationSetting = async (userId, notificationSetting, notificationSettingNewValue, onSuccess, onError) => {
    try {
        const setting = db.ref(`notifications/${userId}/notificationsSettings`).child(`${notificationSetting}`);
        await setting.set(notificationSettingNewValue);
        const settingSnapshot = await setting.get();
        return onSuccess(settingSnapshot);
    } catch (error) {
        return onError(error);
    }
}