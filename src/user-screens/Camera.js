import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet } from 'react-native';
import Screen from '../../misc_components/Screen';
import CustomText from '../../misc_components/CustomText';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { openBrowserAsync } from 'expo-web-browser';

export default function Camera() {
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
        Alert.alert(
            "QR code scanned",
            `Go to ${data}?`,
            [
                {
                    text: "OK",
                    onPress: () => {
                        openBrowserAsync(data, { enableBarCollapsing: true })
                        .then(() => setScanned(false))
                        .catch((error) => console.error(error));
                    }
                },
                {
                    text: "Cancel",
                    onPress: () => {
                        setScanned(false);
                    },
                }
            ],
            { cancelable: false }
        );
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