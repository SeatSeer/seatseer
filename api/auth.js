import firebaseApp from "./firebase";

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