import React from 'react';
import Screen from '../../misc_components/Screen';
import CustomText from '../../misc_components/CustomText';
import { useSelector } from 'react-redux';

export default function Home() {
    const currentUserDisplayName = useSelector((state) => state.auth.currentUserDisplayName);
    return (
        <Screen>
            <CustomText text={"Home tab"} />
            <CustomText text={`Welcome, ${currentUserDisplayName}`} />
        </Screen>
    );
}