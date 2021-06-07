import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import SwitchToggle from "react-native-switch-toggle";
import { useTheme } from '@react-navigation/native';
import {overallContext} from '../../context'

export default function Appearance() {
  const theme = useTheme();
  const { toggleTheme } = React.useContext(overallContext);

  return (
      <View style={[styles.container, { background: theme.background }]}>
        <Text style = {{color: theme.colors.text}}>Dark Mode</Text>
        <SwitchToggle
            containerStyle = {styles.containerStyle}
            circleStyle = {styles.circleStyle}
            backgroundColorOn = "white"
            backgroundColorOff = "#a9a9a9"
            switchOn={theme.dark}
            onPress={()=>{toggleTheme()}}
            circleColorOff="white"
            circleColorOn="#a9a9a9"
          />
      </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10
    },

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