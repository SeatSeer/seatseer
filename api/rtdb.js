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