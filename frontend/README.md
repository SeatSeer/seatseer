# SeatSeer
SeatSeer is an app made developed using React Native, Expo CLI and Firebase Authentication to help students find seats more easily.

## Requirements
1. [Node.js](https://nodejs.org/)
2. [Yarn](https://yarnpkg.com/getting-started/install)
3. [Git](https://git-scm.com/)
4. [Expo CLI and Expo Go app](https://docs.expo.io/get-started/installation/)

## Setting up
1. Clone this repository

```bash
git clone https://github.com/SeatSeer/seatseer.git
```

2. Change directory into the project root

```bash
cd seatseer
```

3. Install the required dependencies

```bash
yarn install
```

4. Create a [Firebase](https://firebase.google.com/) project and web application

5. In Firebase, enable Authentication by navigating to Build > Authentication > Get started on your Firebase console

6. In Firebase, enable Realtime Database by navigating to Build > Realtime Database > Get started on your Firebase console

* You may choose to initialise the database in test mode for debugging purposes

7. Obtain the configuration info of your web application by going to _Project Overview_ > _Project Settings_. Scroll down to your app.
Under _SDK setup and configuration_, choose _Config_. The configuration info will be given in the form `const firebaseConfig = { ... };`

8. Create a `.env` file in the project root directory

9. Fill the `.env` file with the configuration info of your Firebase web application as follows:

```sh
API_KEY=<your firebaseConfig.apiKey>
AUTH_DOMAIN=<your firebaseConfig.authDomain>
DATABASE_URL=<your firebaseConfig.databaseURL>
PROJECT_ID=<your firebaseConfig.projectId>
STORAGE_BUCKET=<your firebaseConfig.storageBucket>
MESSAGING_SENDER_ID=<your firebaseConfig.messagingSenderId>
APP_ID=<your firebaseConfig.appId>
MEASUREMENT_ID=<your firebaseConfig.measurementId>
```

## Running the demo
In the working directory, use expo start to start the application.

```bash
expo start
```

Scan the QR code on your device to load the demo on the Expo Go app.

If you have trouble loading the app, make sure that you are on the same wifi network on your computer and your device.
If it still doesn't work, it might be due to your router or your computer's firewall configuration. In this case, choose the "Tunnel" connection type in Expo Dev Tools, or type the following into the terminal instead:

```bash
expo start --tunnel
```

## Remarks

### Timer bug on Android

A common bug on Android involves an issue with Firebase setting long timers, resulting in the following warning:

```
Setting a timer for a long period of time, i.e. multiple minutes, is a performance and correctness issue on Android
as it keeps the timer module awake, and timers can only be called when the app is in the foreground.
```

If this bothers you, you may follow these instructions for a temporary fix (solution adapted from [here](https://stackoverflow.com/questions/44603362/setting-a-timer-for-a-long-period-of-time-i-e-multiple-minutes)).

1. Navigate to the node_modules/react-native/Libraries/Core/Timers/JSTimers.js file

2. Look for the variable MAX_TIMER_DURATION_MS

3. Change its value to 10000 * 1000

4. Save the changes (with auto format turned off) and re-build the app.