import React from 'react';
import store from './store/store';
import { Provider } from 'react-redux';
import Start from './src/Start';
import { LogBox } from 'react-native';

export default function App() {
  LogBox.ignoreAllLogs();
  return (
    <Provider store={store}>
      <Start />
    </Provider>
  );
}