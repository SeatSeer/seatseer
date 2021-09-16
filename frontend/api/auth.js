import firebaseApp from "./firebase";
import firebase from "firebase/app";
import { deleteAllUserData } from "./rtdb";
import "firebase/auth";

const auth = firebaseApp.auth();

export const logIn = async ({ email, password }, onSuccess, onError) => {
    try {
        const { user } = await auth.signInWithEmailAndPassword(email, password);
        return onSuccess(user);
    } catch (error) {
        return onError(error);
    }
}

export const logOut = async (onSuccess, onError) => {
    try {
        await auth.signOut();
        return onSuccess();
    } catch (error) {
        return onError();
    }
}

export const createAccount = async ({ name, email, password }, onSuccess, onError) => {
    try {
        const { user } = await auth.createUserWithEmailAndPassword(email, password);
        if (user) {
            await user.updateProfile({ displayName: name });
            await user.sendEmailVerification();
            return onSuccess(user);
        }
    } catch (error) {
        return onError(error);
    }
}

export const getCurrentUserId = auth.currentUser ? auth.currentUser.uid : null;

export const getCurrentUsername = auth.currentUser ? auth.displayName : null;

export const setOnAuthStateChanged = (onUserAuthenticated, onUserNotFound) =>
    auth.onAuthStateChanged((user) => {
        if (user) {
            return onUserAuthenticated(user);
        } else {
            return onUserNotFound(user);
        }
    });

export const setOnUserEmailVerifiedChanged = async (onUserEmailVerified, onUserEmailNotVerified) => {
    if (auth.currentUser) {
        await auth.currentUser.reload();
        if (auth.currentUser.emailVerified) {
            return onUserEmailVerified(auth.currentUser);
        } else {
            return onUserEmailNotVerified();
        }
    } else {
        console.error("No user found");
    }
}

export const setOnPasswordReset = async (email, onSuccessfulResetPasswordEmailSent, onPasswordEmailFailedToSend) => {
    await auth.sendPasswordResetEmail(email)
    .then(onSuccessfulResetPasswordEmailSent)
    .catch((error) => onPasswordEmailFailedToSend(error));
}

export const reauthenticateUser = async (email, password, onSuccessfulReauthentication, onFailedReauthentication) => {
    let credentials = firebase.auth.EmailAuthProvider.credential(email, password);
    await auth.currentUser.reauthenticateWithCredential(credentials)
    .then(onSuccessfulReauthentication)
    .catch((error) => onFailedReauthentication(error));
}

export const setOnUserEmailChanged = async (email, password, newEmail, onUserEmailChanged, onUserEmailFailedToChange) => {
    try {
        let credentials = firebase.auth.EmailAuthProvider.credential(email, password);
        await auth.currentUser.reauthenticateWithCredential(credentials);
        await auth.currentUser.updateEmail(newEmail);
        await auth.currentUser.sendEmailVerification();
        return onUserEmailChanged();
    } catch (error) {
        return onUserEmailFailedToChange(error);
    }
}

export const deleteCurrentUser = async (onSuccessfulDeletion, onFailedDeletion) => {
    try {
        await deleteAllUserData(auth.currentUser.uid, () => {}, console.error);
        await auth.currentUser.delete();
        return onSuccessfulDeletion();
    } catch (error) {
        return onFailedDeletion(error);
    }
}