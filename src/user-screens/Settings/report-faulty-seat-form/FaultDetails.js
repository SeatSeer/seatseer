import React, { useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, View, TextInput, KeyboardAvoidingView } from 'react-native';
import { Button } from 'react-native-paper';
import DismissKeyboard from '../../../../misc_components/DismissKeyboard';
import Screen from '../../../../misc_components/Screen';
import { addReport } from '../../../../api/rtdb';
import { useSelector } from 'react-redux';

export default function FaultDetails({ navigation, route }) {
    const [details, setDetails] = useState("");
    const currentUserId = useSelector((state) => state.auth.currentUserId);
    const detailsTextInput = useRef();
    const { location, seatNumber } = route.params;

    useEffect(() => {
        detailsTextInput.current.focus();
    }, []);

    function handleSubmit() {
        if (details) {
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
            );
        } else {
            Alert.alert(
                "Incomplete Details",
                "Please fill in the details of the fault you have encountered.",
                [
                    {
                        text: "OK"
                    }
                ]
            );
        }
    }
    
    return (
        <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{flex: 1}}
        >
            <DismissKeyboard>
                <Screen screenStyle={styles.container}>
                    <View style={styles.details_input_view}>
                        <TextInput
                            ref={detailsTextInput}
                            style={styles.details_text_input}
                            returnKeyType="done"
                            placeholderTextColor="#003f5c"
                            placeholder="e.g. Seat sensor stopped working"
                            onChangeText={setDetails}
                            multiline={true}
                            onSubmitEditing={handleSubmit}
                            allowFontScaling={false}
                        />
                    </View>

                    <Button
                        mode="contained"
                        onPress={handleSubmit}
                        color='#46f583'
                        uppercase={false}
                        style={{marginTop: 20, width: '80%'}}
                    >Submit report</Button>
                </Screen>
            </DismissKeyboard>
        </KeyboardAvoidingView>

    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'flex-start',
    },

    details_input_view: {
        backgroundColor: "#dbd6d2",
        width: "80%",
        height: "60%",
        paddingHorizontal: 10,
        marginTop: 10
    },

    details_text_input: {
        backgroundColor: "#dbd6d2",
        height: 45,
        width: "100%",
        height: "100%",
        textAlign: "left",
        paddingHorizontal: 3        
    },
})