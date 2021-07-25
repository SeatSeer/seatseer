import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Screen from '../../../../misc_components/Screen';
import CustomText from '../../../../misc_components/CustomText';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function Camera({ navigation }) {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    /**
     * Callback function when a barcode is successfully scanned
     * @param {BarCodeScanner.Constants.BarCodeType} type - The barcode type.
     * @param {String} data - The information encoded in the bar code.
     */
    function handleBarCodeScanned({ type, data }) {
        /** @todo Create separate alert to reject QR codes not designed by us */
        setScanned(true);
        const seatDetails = JSON.parse(data);
        navigation.navigate('SeatDetails', {
            locationId: seatDetails.roomId,
            seatNumber: seatDetails.seatNumber
        })
    }

    if (hasPermission === null) {
        return (
            <Screen>
                <CustomText text={"Requesting for permission to access camera"} />
            </Screen>
        );
    } else if (hasPermission === false) {
        return (
            <Screen>
                <CustomText text={"No access to camera"} />
            </Screen>
        );
    } else {
        return (
            <Screen>
                <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
                style={StyleSheet.absoluteFillObject} />
            </Screen>
        );
    }
}