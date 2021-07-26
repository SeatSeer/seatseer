import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, TextInput, KeyboardAvoidingView } from 'react-native';
import { Button } from 'react-native-paper';
import DismissKeyboard from '../../../../misc_components/DismissKeyboard';
import Screen from '../../../../misc_components/Screen';
import CustomText from '../../../../misc_components/CustomText';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { idSearch, checkValidLocationId, checkValidSeatId } from '../../../../backend/ElasticSearch';

export default function SeatDetails({ navigation, route }) {
    const [location, setLocation] = useState("");
    const [seatNumber, setSeatNumber] = useState("");
    const [locationFieldError, setLocationFieldError] = useState(null);
    const [seatNumberFieldError, setSeatNumberFieldError] = useState(null);
    const seatLocationTextInput = useRef();
    const seatNumberTextInput = useRef();
    
    useEffect(() => {
        seatLocationTextInput.current.focus();
    }, []);

    useEffect(() => {
        if (route.params) {
            setLocation(route.params.locationId);
            setSeatNumber(route.params.seatNumber);
        }
    }, [route.params]);

    function handleSubmit() {
        if (location && seatNumber) {
            // Query from backend to check if the inputs are valid
            idSearch([location], 
                (results) => {
                    if (!checkValidLocationId(results)) {
                        setLocationFieldError(`Invalid location ID.`);
                        setSeatNumberFieldError(null);
                        return;
                    }
                    if (!checkValidSeatId(results, seatNumber)) {
                        setLocationFieldError(null);
                        setSeatNumberFieldError(`Invalid seat ID.`);
                        return;
                    }
                    setLocationFieldError(null);
                    setSeatNumberFieldError(null);
                    navigation.navigate("FaultDetails", { location, seatNumber });
                },
                (error) => console.error(`ID search in Seat Details: ${error}`)
            )
        } else {
            if (!location) {
                setLocationFieldError("Compulsory field.");
            } else {
                setLocationFieldError(null);
            }
            if (!seatNumber) {
                setSeatNumberFieldError("Compulsory field.");
            } else {
                setSeatNumberFieldError(null);
            }
        }
    }

    /** @todo Make faulty seat location and seat number drop downs that show options to be selected. */
    return (
        <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{flex: 1}}
        >
            <DismissKeyboard>
                <Screen screenStyle={styles.container}>
                    <CustomText text="Spotted a fault? Tell us!" textStyle={{fontWeight: 'bold', fontSize: 20, marginVertical: 5}} />

                    <View style={{marginTop: 10, width: '80%', alignItems: 'center'}}>
                        <CustomText text={"Faulty seat location ID"} textStyle={{alignSelf: 'flex-start', fontSize: 12, marginBottom: 2}} />
                        <View style={{...styles.seat_location_view, borderWidth: locationFieldError ? 1 : 0, borderColor: 'red', marginBottom: locationFieldError ? 0 : 10}}>
                            <TextInput
                                ref={seatLocationTextInput}
                                style={styles.seat_location_text_input}
                                returnKeyType="next"
                                placeholder="e.g. GE5"
                                placeholderTextColor="#003f5c"
                                onChangeText={setLocation}
                                onSubmitEditing={() => seatNumberTextInput.current.focus()}
                                allowFontScaling={false}
                                defaultValue={route.params ? route.params.locationId : ""}
                                value={location}
                            />
                        </View>
                        {
                            locationFieldError
                                ? <CustomText text={locationFieldError} textStyle={{alignSelf: 'flex-start', color: 'red', fontSize: 10, marginBottom: 10}} />
                                : <></>
                        }

                        <CustomText text={"Seat ID"} textStyle={{alignSelf: 'flex-start', fontSize: 12, marginBottom: 2}} />
                        <View style={{...styles.seat_number_view, borderWidth: seatNumberFieldError ? 1 : 0, borderColor: 'red'}}>
                            <TextInput
                                ref={seatNumberTextInput}
                                style={styles.seat_number_text_input}
                                keyboardType="number-pad"
                                returnKeyType="go"
                                placeholder="e.g. 23"
                                placeholderTextColor="#003f5c"
                                onChangeText={setSeatNumber}
                                onSubmitEditing={handleSubmit}
                                allowFontScaling={false}
                                defaultValue={route.params ? route.params.seatNumber : ""}
                                value={seatNumber}
                            />
                        </View>
                        {
                            seatNumberFieldError
                                ? <CustomText text={seatNumberFieldError} textStyle={{alignSelf: 'flex-start', color: 'red', fontSize: 10}} />
                                : <></>
                        }
                    </View>

                    <Button
                        mode="contained"
                        onPress={()=> navigation.navigate("Camera")}
                        color='#cfcdcc'
                        uppercase={false}
                        style={{width: '80%', marginTop: 20}}
                        icon={({ size, color }) => (<Ionicons name="qr-code-outline" color={color} size={size} />)}
                    >Scan QR (autofills seat info)</Button>

                    <Button
                        mode="contained"
                        onPress={handleSubmit}
                        color='#46f583'
                        uppercase={false}
                        style={{width: '80%', marginTop: 10}}
                    >Next</Button>
                </Screen>
            </DismissKeyboard>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'flex-start',
    },

    seat_location_view: {
        backgroundColor: "#dbd6d2",
        borderRadius: 5,
        width: "100%",
        height: 45,
    },
    
    seat_location_text_input: {
        height: 45,
        width: "100%",
        textAlign: "left",
        paddingHorizontal: 10,
    },

    seat_number_view: {
        backgroundColor: "#dbd6d2",
        borderRadius: 5,
        width: "100%",
        height: 45,
    },
    
    seat_number_text_input: {
        height: 45,
        width: "100%",
        textAlign: "left",
        paddingHorizontal: 10,
    },
})