import React from 'react';
import { StyleSheet } from 'react-native';
import SwitchToggle from "react-native-switch-toggle";
import Screen from '../../../misc_components/Screen';
import CustomText from '../../../misc_components/CustomText';
import { useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { toggleDarkTheme } from '../../../store/slices/themeSlice';

export default function Appearance() {
  const theme = useTheme();
  const dispatch = useDispatch();

  return (
    <Screen>
      <CustomText text={"Dark Mode"} textStyle={{ fontSize: 17 }} />
      <SwitchToggle
        containerStyle={styles.containerStyle}
        circleStyle={styles.circleStyle}
        backgroundColorOn="white"
        backgroundColorOff="#a9a9a9"
        switchOn={theme.dark}
        onPress={() => dispatch(toggleDarkTheme())}
        circleColorOff="white"
        circleColorOn="#a9a9a9"
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  containerStyle : {
    marginTop: 16,
    width: 108,
    height: 48,
    borderRadius: 25,
    borderColor: `#000000`,
    backgroundColor: '#0000ff',
    padding: 5
  },

  circleStyle : {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderColor: `#000000`,
    backgroundColor: '#ffffff'
  }
})