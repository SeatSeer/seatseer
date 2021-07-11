import React, { useState } from 'react';
import { Alert, StyleSheet, View, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import DismissKeyboard from '../../../misc_components/DismissKeyboard';
import Screen from '../../../misc_components/Screen';
import CustomText from '../../../misc_components/CustomText';
import { addReport } from '../../../api/rtdb';
import { useSelector } from 'react-redux';

export default function ReportFaultySeat({ navigation }) {
    const [location, setLocation] = useState("");
    const [seatNumber, setSeatNumber] = useState("");
    const [details, setDetails] = useState("");
    const currentUserId = useSelector((state) => state.auth.currentUserId);

    function handleSubmit() {
        Alert.alert(
            "Report Submission",
            "Would you like to submit this form?",
            [
                {
                    text: "Yes",
                    onPress: () => {
                        addReport(currentUserId, location, seatNumber, details,
                            // onSuccess
                            () => {
                                setLocation("");
                                setSeatNumber("");
                                setDetails("");
                                Alert.alert(
                                    "Report Submitted",
                                    "Thank you for your help!",
                                    [{ text: "OK", onPress: () => navigation.navigate("Settings") }],
                                    { cancelable: true }
                                )
                            },
                            // onError
                            console.error
                        )
                    }
                },
                {
                    text: "No"
                }
            ],
            { cancelable: true }
        )
    }

    /** @todo Make faulty seat location and seat number drop downs that show options to be selected. */
    return (
        <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={50}
        style={styles.container}
        contentContainerStyle={styles.content_container}>
            <DismissKeyboard>
                <Screen style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    
                        <CustomText text={"Faulty seat location"} textStyle={{textAlign: 'left'}} />
                        <View style={styles.location_view}>
                            <TextInput
                                style={styles.location_text_input}
                                onChangeText={setLocation}
                                placeholderTextColor="#003f5c"
                                placeholder="e.g. Central Library Level 5"
                                multiline={true}
                            />
                        </View>

                        <CustomText text={"Seat number"} textStyle={{textAlign: 'left'}} />
                        <View style={styles.seat_view}>
                            <TextInput
                                style={styles.seat_text_input}
                                onChangeText={setSeatNumber}
                                placeholderTextColor="#003f5c"
                                placeholder="e.g. 23"
                                multiline={true}
                            />
                        </View>

                        <CustomText text={"Details of fault"} textStyle={{textAlign: 'left'}} />
                        <View style={styles.details_view}>
                            <TextInput
                                style={styles.details_text_input}
                                onChangeText={setDetails}
                                placeholderTextColor="#003f5c"
                                placeholder="e.g. Seat sensor stopped working"
                                multiline={true}
                            />
                        </View>

                    <TouchableOpacity style={styles.submit_button} onPress={handleSubmit}>
                        <CustomText text={"Submit Feedback"} />
                    </TouchableOpacity>
                </Screen>
            </DismissKeyboard>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    content_container: {
        alignItems: 'center',
        justifyContent: 'center',
    },

    location_view: {
        backgroundColor: "#dbd6d2",
        width: "80%",
        height: "7%",
        paddingHorizontal: 10
    },

    location_text_input: {
        backgroundColor: "#dbd6d2",
        height: 45,
        width: "100%",
        height: "100%",
        textAlign: "left",
        paddingLeft: 10        
    },

    seat_view: {
        backgroundColor: "#dbd6d2",
        width: "80%",
        height: "7%",
        paddingHorizontal: 10
    },

    seat_text_input: {
        backgroundColor: "#dbd6d2",
        height: 45,
        width: "100%",
        height: "100%",
        textAlign: "left",
        paddingLeft: 10        
    },

    details_view: {
        backgroundColor: "#dbd6d2",
        width: "80%",
        height: "50%",
        paddingHorizontal: 10
    },

    details_text_input: {
        backgroundColor: "#dbd6d2",
        height: 45,
        width: "100%",
        height: "100%",
        textAlign: "left",
        paddingLeft: 10        
    },

    submit_button: {
        width: "80%",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
        backgroundColor: "#46f583",
    },
})