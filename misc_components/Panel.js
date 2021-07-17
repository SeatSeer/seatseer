import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Platform, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Avatar, Overlay, Rating } from "react-native-elements";
import { Button, Badge } from "react-native-paper";
import CrowdednessIndicator from "./CrowdednessIndicator";
import { useTheme, useNavigation, useRoute } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useSelector } from 'react-redux';
import { addFavourite, removeFavourite, checkFavourite } from "../api/rtdb";
import CustomText from "./CustomText";

const PanelTabs = createMaterialTopTabNavigator();

function FloorPlanTab(props) {
    return (
        <ScrollView style={{flex: 1, paddingHorizontal: 5}}>
            <CustomText text={"Coming soon in Milestone 3!"} />
        </ScrollView>
    )
}

function ReviewsTab(props) {
    const { colors } = useTheme();

    return (
        <ScrollView style={{flex: 1, paddingHorizontal: 5}}>
            <CustomText text={`Rating: ${props.rating.toFixed(2)}/5`} textStyle={{paddingVertical: 5, fontWeight: 'bold', fontSize: 30, alignSelf: 'center'}} />
            <Rating type='custom' imageSize={30} readonly fractions={2} startingValue={props.rating} tintColor={colors.background} ratingBackgroundColor='#b0b0b0' />

            <View style={{height: 0.5, width: '100%', backgroundColor: "grey", marginVertical: 5}} />

            <CustomText text={"Comments:"} textStyle={{paddingVertical: 5, fontWeight: 'bold', fontSize: 20}} />
            <View style={{height: 0.5, width: '100%', backgroundColor: "grey", marginVertical: 5}} />
            {
                props.comments.map((comment, index) => (
                    <View key={index} style={{width: '100%'}}>
                        <CustomText text={comment} textStyle={{fontSize: 17}} />
                        <View style={{height: 0.5, width: '100%', backgroundColor: "grey", marginVertical: 5}} />
                    </View>
                ))
            }
            
            <Button
                mode="contained"
                color='#46f583'
                uppercase={false}
                titleStyle={{fontSize: 12}}
                style={{marginVertical: 10, width: '80%', alignSelf: 'center'}}
                onPress={() => {}}
            >Leave a review!</Button>
        </ScrollView>
    );
}

function AboutTab(props) {
    const navigation = useNavigation();

    return (
        <ScrollView style={{flex: 1, paddingHorizontal: 5}}>
            <CustomText text={"People who search for this location also search for"} textStyle={{fontSize: 16, paddingVertical: 5}} />
            <View style={{flexDirection: 'row', justifyContent: 'flex-start', flexWrap: 'wrap', }}>
                {
                    props.related.map((tag, index) => (
                        <Badge key={tag} size={30} style={{margin: 2, backgroundColor: '#b0b0b0'}}>{tag}</Badge>
                    ))
                }
            </View>

            <View style={{height: 0.5, width: '100%', backgroundColor: "grey", marginVertical: 5}} />

            <CustomText text={"Filters"} textStyle={{fontSize: 16, paddingVertical: 5}} />
            <View style={{flexDirection: 'row', justifyContent: 'flex-start', flexWrap: 'wrap'}}>
                {
                    props.filters.map((tag, index) => (
                        <Badge key={tag} size={30} style={{margin: 2, backgroundColor: '#b0b0b0'}}>{tag}</Badge>
                    ))
                }
            </View>

            <View style={{height: 0.5, width: '100%', backgroundColor: "grey", marginVertical: 5}} />

            <Button
                mode="contained"
                color='#ff6961'
                uppercase={false}
                titleStyle={{fontSize: 12}}
                style={{marginTop: 10, width: '80%', alignSelf: 'center'}}
                onPress={() => navigation.navigate('Settings', { screen: 'ReportFaultySeat', initial: false })}
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
        >
            <PanelTabs.Screen name="FloorPlan" children={() => <FloorPlanTab />} />
            <PanelTabs.Screen name="Reviews" children={() => <ReviewsTab comments={props.comments} rating={props.rating} />} />
            <PanelTabs.Screen name="About" children={() => <AboutTab filters={props.filters} related={props.related} />} />
        </PanelTabs.Navigator>
    );
}

export default function Panel({ data }) {
    /**
     * data contains the following properties:
     * id -> locationId (string)
     * name -> name of the location (string)
     * avatar -> avatar displayed on the panel (string)
     * seats -> total number of vacant seats (string)
     * vacancyPercentage -> vacant seats / total seats (float)
     * coordinates -> { latitude: (float), longitude: (float) }
     * rating -> Out of 5 (float)
     * comments -> Array of strings
     * filters -> filters that can be applied to the location
     * related -> keywords that are related to the location
     */
    const currentUserId = useSelector((state) => state.auth.currentUserId);
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

    function toggleAdditionalInfoVisibility() {
        setAdditionalInfoVisible(!additionalInfoVisible);
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={toggleAdditionalInfoVisibility} style={styles.panel}>
                <View style={styles.avatar_view}>
                {
                    Platform.OS === "ios"
                        ? <Avatar size="small" rounded title={data.avatar} containerStyle={{backgroundColor: '#b0b0b0'}} />
                        : <Avatar size="small" rounded title={data.avatar} titleStyle={{fontSize: 10}} containerStyle={{backgroundColor: '#b0b0b0'}} />
                }
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
                    <Ionicons name={alert ? "notifications" : "notifications-outline"} size={30} color="gold" onPress={() => setAlert(!alert)} />
                </View>
            </TouchableOpacity>

            <Overlay isVisible={additionalInfoVisible} onBackdropPress={toggleAdditionalInfoVisibility} overlayStyle={{...styles.additional_info, backgroundColor: colors.background}} >
                <View style={styles.header}>
                    <View style={styles.avatar_view}>
                    {
                        Platform.OS === "ios"
                            ? <Avatar size="small" rounded title={data.avatar} containerStyle={{backgroundColor: '#b0b0b0'}} />
                            : <Avatar size="small" rounded title={data.avatar} titleStyle={{fontSize: 10}} containerStyle={{backgroundColor: '#b0b0b0'}} />
                    }
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
                        <Ionicons name={alert ? "notifications" : "notifications-outline"} size={30} color="gold" onPress={() => setAlert(!alert)} />
                    </View>
                </View>

                <View style={{flex: 1}}>
                    <AdditionalInfo comments={data.comments} rating={data.rating} filters={data.filters} related={data.related} />
                </View>
            </Overlay>
        </View>
    );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        width: width,
        height: 0.12 * height,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'darkgrey'
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
        // width: '10%',
        // height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
    },

    panel_text_view: {
        flex: 7,
        // width: '70%',
        // height: '100%',
        alignItems: 'flex-start',
        justifyContent: 'center'
    },

    heart: {
        flex: 1,
        // width: '10%',
        // height: '100%',
        // backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center'
    },

    bell: {
        flex: 1,
        // width: '10%',
        // height: '100%',
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
        width: '100%',
        height: 0.12 * height,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: 'darkgrey'
    }
});