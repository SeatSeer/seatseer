import React, { useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, View, TextInput, KeyboardAvoidingView, Dimensions } from 'react-native';
import { Button } from 'react-native-paper';
import DismissKeyboard from '../../../misc_components/DismissKeyboard';
import Screen from '../../../misc_components/Screen';
import CustomText from '../../../misc_components/CustomText';
import { addFeedback } from '../../../api/rtdb';
import { useSelector } from 'react-redux';

export default function Feedback({ navigation }) {
    const [text, setText] = useState("");
    const currentUserId = useSelector((state) => state.auth.currentUserId);
    const feedbackTextInput = useRef();

    useEffect(() => {
        feedbackTextInput.current.focus();
    }, []);

    function handleSubmit() {
        if (text) {
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
        } else {
            Alert.alert(
                "Invalid Feedback",
                "Please write some feedback before submitting.",
                [{ text: "OK" }],
                { cancelable: true }
            )
        }
    }

    return (
        <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{flex: 1}}
        >
            <DismissKeyboard>
                <Screen screenStyle={styles.container}>
                    <CustomText text={"Tell us how we can improve!"} textStyle={{fontWeight: 'bold', fontSize: 20, marginVertical: 5}} />
                    
                    <View style={styles.feedback_input_view}>
                        <TextInput
                            ref={feedbackTextInput}
                            style={styles.feedback_text_input}
                            returnKeyType="go"
                            placeholderTextColor="#003f5c"
                            placeholder="Write your feedback here"
                            onChangeText={setText}
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
                        style={{marginTop: 10, width: '80%'}}
                    >Submit feedback</Button>
                </Screen>
            </DismissKeyboard>
        </KeyboardAvoidingView>
    );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'flex-start',
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
        paddingHorizontal: 3        
    },
})