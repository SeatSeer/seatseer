import React, { useState } from 'react';
import { Alert, StyleSheet, View, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import DismissKeyboard from '../../../misc_components/DismissKeyboard';
import Screen from '../../../misc_components/Screen';
import CustomText from '../../../misc_components/CustomText';
import { addFeedback } from '../../../api/rtdb';
import { useSelector } from 'react-redux';

export default function Feedback({ navigation }) {
    const [text, setText] = useState("");
    const currentUserId = useSelector((state) => state.auth.currentUserId);

    function handleSubmit() {
        Alert.alert(
            "Feedback Submission",
            "Would you like to submit your feedback?",
            [
                {
                    text: "Yes",
                    onPress: () => {
                        addFeedback(currentUserId, text,
                            // onSuccess
                            () => {
                                setText("");
                                Alert.alert(
                                    "Feedback Submitted",
                                    "Thank you for your feedback! We'll keep working hard to improve SeatSeer!",
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

    return (
        <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={50}
        style={styles.container}
        contentContainerStyle={styles.content_container}>
            <DismissKeyboard>
                <Screen style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    
                        <CustomText text={"Tell us how we can improve our app below!"} textStyle={{textAlign: 'left'}} />
                        
                        <View style={styles.feedback_input_view}>
                            <TextInput
                                style={styles.feedback_text_input}
                                placeholderTextColor="#003f5c"
                                placeholder="Write your feedback here"
                                onChangeText={setText}
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

    feedback_input_view: {
        backgroundColor: "#dbd6d2",
        width: "80%",
        height: "60%",
        paddingHorizontal: 10
    },

    feedback_text_input: {
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