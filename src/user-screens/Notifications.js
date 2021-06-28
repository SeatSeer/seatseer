import React from 'react';
import Screen from '../../misc_components/Screen';
import CustomText from '../../misc_components/CustomText';

export default function Notifications() {
    return (
        <Screen>
            <CustomText text={"Notifications"} textStyle={{ fontSize: 20, fontWeight: 'bold', paddingVertical: 30 }} />
            <CustomText text={"Coming soon in Milestone 3!"} />
        </Screen>
    );
}