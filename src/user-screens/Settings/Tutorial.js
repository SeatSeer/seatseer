import React from 'react';
import Screen from '../../../misc_components/Screen';
import CustomText from '../../../misc_components/CustomText';

export default function Tutorial() {
    return (
        <Screen>
            <CustomText text={`Would you like to go through the tutorial?`} />
        </Screen>
    );
}