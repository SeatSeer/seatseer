import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import {
    API_KEY,
    AUTH_DOMAIN,
    PROJECT_ID,
    STORAGE_BUCKET,
    MESSAGING_SENDER_ID,
    APP_ID,
    MEASUREMENT_ID,
    DATABASE_URL
} from "@env";

  const firebaseConfig = {
    apiKey: API_KEY,
    authDomain: AUTH_DOMAIN,
    projectId: PROJECT_ID,
    storageBucket: STORAGE_BUCKET,
    messagingSenderId: MESSAGING_SENDER_ID,
    appId: APP_ID,
    measurementId: MEASUREMENT_ID,
    databaseURL: DATABASE_URL
  };


const firebaseApp = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

/** In case the firebase config changes and we need to reset the app */
// const firebaseApp = firebase.app().delete().then(function() {
//   firebase.initializeApp(firebaseConfig);
// });

export default firebaseApp