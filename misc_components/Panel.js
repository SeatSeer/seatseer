import React, { useEffect, useState } from "react";
import { Alert, View, StyleSheet, TouchableOpacity, TextInput, ScrollView, Dimensions, SectionList, KeyboardAvoidingView } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Avatar, Badge, Overlay, Rating } from "react-native-elements";
import { Button } from "react-native-paper";
import CrowdednessIndicator from "./CrowdednessIndicator";
import { useTheme, useNavigation, useRoute } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useSelector } from 'react-redux';
import { getPermissionsAsync } from 'expo-notifications';
import { addFavourite, removeFavourite, checkFavourite, addNotification, removeNotification, checkNotification } from "../api/rtdb";
import CustomText from "./CustomText";
import { filterWords, sendRatingToElasticSearch, sendCommentToElasticSearch } from "../backend/ElasticSearch";
import { addToKafkaNotifications, deleteFromKafkaNotifications } from '../backend/Kafka';

const PanelTabs = createMaterialTopTabNavigator();

function FloorPlanTab(props) {
    return (
        <ScrollView style={{flex: 1, paddingHorizontal: 5}}>
            <CustomText text={"Coming soon!"} />
        </ScrollView>
    )
}

function ReviewsTab(props) {
    const [myRating, setMyRating] = useState(null);
    const [myComment, setMyComment] = useState("");
    const [isRefreshing, setIsRefreshing] = useState(false);
    const currentUserDisplayName = useSelector((state) => state.auth.currentUserDisplayName);
    const { colors } = useTheme();

    const sections = [
        {
            title: `Rating`,
            data: [`${props.rating}`],
            ratingInfo: props.ratingInfo
        },
        {
            title: `Leave a review`,
            data: [`Leave a review`],
        },
        {
            title: `Comments`,
            data: props.comments.map(comment => comment.split('\`')),
            // data: [1,2,3,4,5,6,7,8,9,10]
        }
    ]

    const renderReviewsTab = ({ item, index, section, separators }) => {
        switch (section.title) {
            case `Rating`:
                return (
                    <View style={{flex: 1}}>
                        <CustomText text={`Rating: ${props.rating}/5`} textStyle={{paddingVertical: 5, fontWeight: 'bold', fontSize: 30, alignSelf: 'center'}} />
                        <Rating type='custom' imageSize={30} readonly fractions={2} startingValue={props.rating} tintColor={colors.background} ratingBackgroundColor='#b0b0b0' />
                        <CustomText text={`(${props.ratingInfo[0]} people have rated this place)`} textStyle={{alignSelf: 'center', marginVertical: 5}} />
                    </View>
                );
            case `Leave a review`:
                return (
                    <View style={{flex: 1}}>
                        <CustomText text="Leave a review!" textStyle={{paddingVertical: 5, fontWeight: 'bold', fontSize: 20, alignSelf: 'center'}} />
                        <Rating type='custom' imageSize={30} startingValue={0} tintColor={colors.background} ratingBackgroundColor='#b0b0b0' onFinishRating={setMyRating} />
                        <CustomText text={`How would you rate this place out of 5 stars?`} textStyle={{alignSelf: 'center', marginVertical: 5}} />
                        <View style={styles.comment_input_view}>
                            <TextInput
                                style={styles.comment_text_input}
                                returnKeyType="go"
                                placeholderTextColor="#003f5c"
                                placeholder="Leave a comment for others to see!"
                                onChangeText={setMyComment}
                                multiline={true}
                                onSubmitEditing={submitReview}
                                allowFontScaling={false}
                            />
                        </View>
                        <Button
                            mode="contained"
                            color='#46f583'
                            uppercase={false}
                            titleStyle={{fontSize: 12}}
                            style={{marginVertical: 10, width: '80%', alignSelf: 'center'}}
                            onPress={submitReview}
                        >Submit your review</Button>
                    </View>
                );
            case `Comments`:
                if (item[2]) {
                    return (
                        <View style={{flex: 1, padding: 10, alignItems: 'flex-start'}}>
                            <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginBottom: 10}}>
                                <Avatar size="small" rounded renderPlaceholderContent={<CustomText text={item[0].charAt(0)} textStyle={{color: 'white', fontSize: 12}} />} containerStyle={{backgroundColor: '#b0b0b0'}} />
                                <CustomText text={item[0]} textStyle={{fontSize: 15, marginLeft: 5}} />
                            </View>
                            <Rating type='custom' imageSize={15} readonly fractions={2} startingValue={item[1]} tintColor={colors.background} ratingBackgroundColor='#b0b0b0' />
                            <CustomText text={item[2]} textStyle={{fontSize: 17, marginVertical: 5}} />
                        </View>
                    );
                } else {
                    return;
                }
            default:
                return;
        }
    }

    function submitReview() {
        if (myRating === null) {
            Alert.alert(
                "Rating required",
                "Please rate the location out of 5 stars!",
                [{ text: "OK" }],
                { cancelable: true }
            );
        } else {
            Alert.alert(
                "Submit review",
                "Would you like to submit your review?",
                [
                    {
                        text: "Yes",
                        onPress: async () => {
                            await sendRatingToElasticSearch(myRating, props.locationId, () => console.log(`Rating successfully sent`), (error) => console.error(`Rating error: ${error}`));
                            await sendCommentToElasticSearch(currentUserDisplayName, myRating, myComment, props.locationId, () => console.log(`Comment successfully sent`), (error) => console.error(`Comment error: ${error}`));
                            setIsRefreshing(true);
                            setTimeout(() => {
                                props.handleRefresh();
                                setIsRefreshing(false);
                            }, 1000);
                        }
                    },
                    { text: "No" },
                    { cancelable: true }
                ]
            )
        }
    }
    
    return (
        <SectionList
            sections={sections}
            renderItem={renderReviewsTab}
            keyExtractor={(item, index) => item + index}
            SectionSeparatorComponent={() => <View style={{height: 0.5, width: '100%', backgroundColor: "grey"}} />}
            ItemSeparatorComponent={() => <View style={{height: 0.5, width: '100%', backgroundColor: "grey", marginVertical: 5}} />}
            initialNumToRender={5}
            refreshing={isRefreshing}
        />
    );
}

function AboutTab(props) {
    const navigation = useNavigation();
    const { colors } = useTheme();

    return (
        <ScrollView style={{flex: 1, paddingHorizontal: 5}}>
            <View style={{height: 0.5, width: '100%', backgroundColor: "grey", marginVertical: 5}} />

            <CustomText text={"Filters"} textStyle={{fontSize: 16, paddingVertical: 5}} />
            <View style={{flexDirection: 'row', justifyContent: 'flex-start', flexWrap: 'wrap'}}>
                {
                    props.filters.map((tag, index) => (
                        <Badge
                            key={tag}
                            value={filterWords[tag]}
                            containerStyle={{margin: 2}}
                            badgeStyle={{backgroundColor: '#b0b0b0'}}
                            textStyle={{color: colors.text}}
                            textProps={{allowFontScaling: false}}
                        />
                    ))
                }
            </View>

            <View style={{height: 0.5, width: '100%', backgroundColor: "grey", marginVertical: 5}} />

            <CustomText text={`Maximum Seating Size: ${props.seatingSize}`} textStyle={{fontSize: 16, paddingVertical: 5}} />

            <View style={{height: 0.5, width: '100%', backgroundColor: "grey", marginVertical: 5}} />

            <Button
                mode="contained"
                color='#ff6961'
                uppercase={false}
                titleStyle={{fontSize: 12}}
                style={{marginTop: 10, width: '80%', alignSelf: 'center'}}
                onPress={() => {
                    navigation.navigate('Settings',
                        {
                            screen: 'ReportFaultySeat',
                            initial: false,
                            params: { 
                                screen: 'SeatDetails',
                                initial: false,
                                params: { locationId: props.locationId, seatNumber: "" }
                            }
                        }
                    )
                }}
            >Report a faulty seat</Button>
        </ScrollView>
    );
}

function AdditionalInfo(props) {
    return (
        <PanelTabs.Navigator
            tabBarOptions={{
                activeTintColor: 'tomato',
                inactiveTintColor: 'gray',
            }}
            swipeEnabled={false}
        >
            <PanelTabs.Screen name="FloorPlan" children={() => <FloorPlanTab />} />
            <PanelTabs.Screen name="Reviews" children={() => <ReviewsTab comments={props.comments} rating={props.rating} ratingInfo={props.ratingInfo} locationId={props.locationId} handleRefresh={props.handleRefresh} />} />
            <PanelTabs.Screen name="About" children={() => <AboutTab filters={props.filters} locationId={props.locationId} seatingSize={props.seatingSize} />} />
        </PanelTabs.Navigator>
    );
}

export default function Panel({ data, handleRefresh }) {
    /**
     * data contains the following properties:
     * id -> locationId (string)
     * name -> name of the location (string)
     * (REMOVED FOR NOW) avatar -> avatar displayed on the panel (string)
     * seats -> total number of vacant seats (string)
     * vacancyPercentage -> vacant seats / total seats (float)
     * coordinates -> { latitude: (float), longitude: (float) }
     * rating -> Out of 5 (float that is already rounded to 2 dp)
     * ratingInfo -> Array of 2 elements, the first being the total number of people who rated this place and the second being the total rating
     * comments -> Array of strings
     * filters -> filters that can be applied to the location
     * seatingSize -> Max seating size of tables at this location
     * (REMOVED FOR NOW) related -> keywords that are related to the location
     * 
     * notification -> Indicates whether a panel is in the notifications tab or not to display the correct information
     * expiryTime -> The time that the user will stop receiving notifications about this location
     * handleRefresh -> Refresh function for the parent tab
     */
    const currentUserId = useSelector((state) => state.auth.currentUserId);
    const expoPushToken = useSelector((state) => state.notifications.expoPushToken);
    const timeLimitHours = useSelector((state) => state.notifications.timeLimitHours);
    const timeLimitMinutes = useSelector((state) => state.notifications.timeLimitMinutes);
    const thresholdVacancy = useSelector((state) => state.notifications.thresholdVacancy);
    const groupedSeats = useSelector((state) => state.notifications.groupedSeats);
    const [alert, setAlert] = useState(false);
    const [favourite, setFavourite] = useState(null);
    const [additionalInfoVisible, setAdditionalInfoVisible] = useState(false);
    const { colors } = useTheme();
    const { name: routeName } = useRoute();

    /**
     * On mounting a panel, we check to see if it is contained in the user's favourite locations by checking Firebase Realtime Database.
     * Once checked, we set the heart icon to be selected or unselected based on the result.
     */
    useEffect(() => {
        checkFavourite(currentUserId, data.id, setFavourite, console.error);
        checkNotification(currentUserId, data.id, setAlert, console.error);
    }, []);

    function toggleFavourite() {
        if (favourite) {
            // Remove from favourites
            removeFavourite(currentUserId, data.id,
                // onSuccess
                () => {
                    if (routeName !== 'FavouritesSubTab') {
                        setFavourite(false);
                    }
                },
                // onError
                console.error
            )
        } else {
            // Add to favourites
            addFavourite(currentUserId, data.name, data.id,
                // onSuccess
                () => {setFavourite(true)},
                // onError
                console.error
            )
        }
    }

    async function toggleAlert() {
        if (alert) {
            // Remove from notifications
            removeNotification(currentUserId, data.id,
                // onSuccess
                () => {
                    if (routeName !== 'Notifications') {
                        setAlert(false);
                    }
                    deleteFromKafkaNotifications(currentUserId, expoPushToken, data.id, () => console.log("SUCCESS"), (error) => console.error(`BAD NEWS: ${error}`))
                },
                // onError
                console.error
            )
        } else {
            const { status: existingStatus } = await getPermissionsAsync();
            // If user does not allow notifications, they are not allowed to add panels to the notifications tab
            if (existingStatus !== 'granted') {
                Alert.alert(
                    "Permission denied",
                    "To use this feature, please allow SeatSeer to access send your device notifications.",
                    [{ text: "OK" }],
                    { cancelable: true }
                )
            } else {
                // If the vacancy of the room is higher than the user's threshold vacancy, alert the user to double confirm
                if (Number(data.seats) >= thresholdVacancy) {
                    Alert.alert(
                        "Alert",
                        "The current number of vacant seats in this room is already sufficient for the number of vacant seats you are currently looking for (i.e. your threshold vacancy).\nDo you still want to be notified about vacancy changes for this location?",
                        [
                            {
                                text: "Yes",
                                onPress: () => {
                                    // Format the expiry date and time correctly to store in firebase and kafka
                                    const notificationDeleteTime = new Date(new Date().valueOf() + timeLimitHours * 3600000 + timeLimitMinutes * 60000).toISOString();
                                    addNotification(currentUserId, notificationDeleteTime, data.id,
                                        // onSuccess
                                        () => {
                                            setAlert(true);
                                            addToKafkaNotifications(currentUserId, expoPushToken, data.id, () => console.log("SUCCESS"), (error) => console.error(`BAD NEWS: ${error}`))
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
                    const notificationDeleteTime = new Date(new Date().valueOf() + timeLimitHours * 3600000 + timeLimitMinutes * 60000).toISOString();
                    addNotification(currentUserId, notificationDeleteTime, data.id,
                        // onSuccess
                        () => {
                            setAlert(true);
                            addToKafkaNotifications(currentUserId, expoPushToken, data.id, () => console.log("SUCCESS"), (error) => console.error(`BAD NEWS: ${error}`))
                        },
                        // onError
                        console.error
                    )
                }
            }
        }
    }

    function toggleAdditionalInfoVisibility() {
        setAdditionalInfoVisible(!additionalInfoVisible);
    }

    /** @todo Animations for going into edit mode */
    function handleLongPress() {
        if (routeName === 'Notifications') {

        }
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={toggleAdditionalInfoVisibility} onLongPress={handleLongPress} style={styles.panel}>
                <View style={styles.avatar_view}>
                    <Avatar size="small" rounded renderPlaceholderContent={<CustomText text={data.id} textStyle={{color: 'white', fontSize: 10}} />} containerStyle={{backgroundColor: '#b0b0b0'}} />
                </View>

                {
                    data.notification
                        ? (<View style={styles.panel_text_view}>
                            <CustomText text={data.name} textStyle={{fontWeight: 'bold', fontSize: 20}} />
                            <CustomText text={`Notification expiry time:`} />
                            <CustomText text={data.expiryTime} />
                            <CustomText text={`Seat threshold: ${thresholdVacancy}`} />
                            <CustomText text={`Grouped seats: ${(thresholdVacancy === 1 || !groupedSeats) ? "DISABLED" : "ENABLED"}`} textStyle={{color: (thresholdVacancy === 1 || !groupedSeats) ? 'red' : 'green'}} />
                        </View>)
                        : (<View style={styles.panel_text_view}>
                            <CustomText text={data.name} textStyle={{fontWeight: 'bold', fontSize: 20}} />
                            <CustomText text={`Seats available: ${data.seats}`} textStyle={{fontSize: 15}} />
                            <CrowdednessIndicator vacancyPercentage={data.vacancyPercentage} />
                        </View>)
                }

                <View style={styles.heart}>
                    <Ionicons name={favourite ? "heart" : "heart-outline"} size={30} color="red" onPress={toggleFavourite} />
                </View>

                <View style={styles.bell}>
                    <Ionicons name={alert ? "notifications" : "notifications-outline"} size={30} color="gold" onPress={toggleAlert} />
                </View>
            </TouchableOpacity>

            <Overlay isVisible={additionalInfoVisible} onBackdropPress={toggleAdditionalInfoVisibility} overlayStyle={{...styles.additional_info, backgroundColor: colors.background}} >
                <View style={styles.header}>
                    <View style={styles.avatar_view}>
                        <Avatar size="small" rounded renderPlaceholderContent={<CustomText text={data.id} textStyle={{color: 'white', fontSize: 10}} />} containerStyle={{backgroundColor: '#b0b0b0'}} />
                    </View>
                    
                    <View style={styles.panel_text_view}>
                        <CustomText text={data.name} textStyle={{fontWeight: 'bold', fontSize: 20}} />
                        <CustomText text={`Seats available: ${data.seats}`} textStyle={{fontSize: 15}} />
                        <CrowdednessIndicator vacancyPercentage={data.vacancyPercentage} />
                    </View>

                    <View style={styles.heart}>
                        <Ionicons name={favourite ? "heart" : "heart-outline"} size={30} color="red" onPress={toggleFavourite} />
                    </View>

                    <View style={styles.bell}>
                        <Ionicons name={alert ? "notifications" : "notifications-outline"} size={30} color="gold" onPress={toggleAlert} />
                    </View>
                </View>

                <View style={{flexGrow: 1, overflow: 'scroll'}}>
                    <AdditionalInfo comments={data.comments} rating={data.rating} ratingInfo={data.ratingInfo} filters={data.filters} locationId={data.id} seatingSize={data.seatingSize} handleRefresh={handleRefresh} />
                </View>
            </Overlay>
        </View>
    );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'darkgrey',
    },

    panel: {
        flexDirection: 'row',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingVertical: 5
    },

    avatar_view: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
    },

    panel_text_view: {
        flex: 7,
        alignItems: 'flex-start',
        justifyContent: 'center'
    },

    heart: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },

    bell: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },

    additional_info: {
        width: width,
        height: 0.8 * height,
        padding: 0
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: 'darkgrey'
    },

    comment_input_view: {
        backgroundColor: "#dbd6d2",
        width: '80%',
        height: 100,
        paddingHorizontal: 10,
        alignSelf: 'center',
        marginTop: 5
    },

    comment_text_input: {
        backgroundColor: "#dbd6d2",
        height: 45,
        width: "100%",
        height: "100%",
        textAlign: "left",
    }
});