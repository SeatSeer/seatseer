import React from 'react';
import { Keyboard,  TouchableWithoutFeedback } from 'react-native';

const DissmissKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>
);

export default DissmissKeyboard