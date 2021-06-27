import React from 'react';
import { StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Screen from './Screen';
import CustomText from './CustomText';

export default function CrowdednessIndicator(props) {
    let color;
    let numberOfPeopleIcons;

    if (props.vacancyPercentage <= 0.2) {
        color = 'red';
        numberOfPeopleIcons = 5;
    } else if (props.vacancyPercentage <= 0.4) {
        color = 'gold';
        numberOfPeopleIcons = 4;
    } else if (props.vacancyPercentage <= 0.6) {
        color = 'green';
        numberOfPeopleIcons = 3;
    } else if (props.vacancyPercentage <= 0.8) {
        color = 'green';
        numberOfPeopleIcons = 2;
    } else {
        color = 'green';
        numberOfPeopleIcons = 1;
    }

    return (
        <Screen screenStyle={styles.container}>
            <CustomText text={"Crowdedness: "} />
            {
                [...Array(numberOfPeopleIcons).keys()].map((index) => (
                    <Icon key={index} name="male" color={color} size={17} style={{paddingHorizontal: 2}} />
                ))
            }
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    }
})