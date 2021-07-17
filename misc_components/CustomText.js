import React from 'react';
import { Text } from "react-native";
import { useTheme } from '@react-navigation/native';

export default function CustomText(props) {
    // If you want extra styling, pass it through the textStyle prop
    const { colors } = useTheme();

    return (
        <Text style={{ ...props.textStyle, color: colors.text }} allowFontScaling={false} {...props}>
            {props.text}
        </Text>
    );
}