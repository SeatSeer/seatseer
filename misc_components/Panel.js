import React, { useEffect, useState } from "react";
import { View, SectionList, StyleSheet, Platform } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Avatar, ListItem } from "react-native-elements";
import CrowdednessIndicator from "./CrowdednessIndicator";
import { useTheme } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { addFavourite, removeFavourite, checkAndSetFavourite, subscribeToFavouritesChanges } from "../api/rtdb";
import CustomText from "./CustomText";
import { Button } from "react-native-elements";

const Item = ({ title }) => (
    <View style={styles.item}>
        <CustomText text={title} textStyle={styles.title} />
    </View>
);

export default function Panel(props, { navigation }) {
    /**
     * props.panel contains the following properties:
     * locationId -> locationId (string)
     * name -> name of the location (string)
     * avatar -> avatar displayed on the panel (string)
     * seats -> total number of vacant seats (string)
     * vacancyPercentage -> vacant seats / total seats (float)
     * coordinates -> { latitude: (float), longitude: (float) }
     * rating -> Out of 5 (float)
     * comments -> Array of strings
     */
    const currentUserId = useSelector((state) => state.auth.currentUserId);
    const [expanded, setExpanded] = useState(false);
    const [alert, setAlert] = useState(false);
    const [favourite, setFavourite] = useState(false);
    const { colors } = useTheme();

    const additionalInfo = [
        {
            title: "Floorplan (Coming soon in Milestone 3!)",
            data: []
        },
        {
            title: "Comments:",
            data: props.panel.comments
        },
        {
            title: `Rating: ${props.panel.rating}/5 stars`,
            data: []
        }
    ]

    useEffect(() => {
        // Determines whether a panel's heart icon is initially selected or not
        checkAndSetFavourite(currentUserId, props.panel.locationId, setFavourite)
    }, []);

    useEffect(() => {
        // Listens for a change in favourites so that the heart icon auto deselects if the location is
        // removed from favourites, and auto selects the heart icon if the location is added to favourites
        // More for syncing up the panels across each tab

        // Should unsubscribe upon unmounting (return the unsubscription callback)
        subscribeToFavouritesChanges(currentUserId,
            // onValueChanged callback
            (locations) => {
                // locations is in the form { locationId1: locationName1, locationId2, locationName2, ... }
                const locationId = props.panel.locationId
                if (locations && locations[locationId]) {
                    setFavourite(true);
                } else {
                    setFavourite(false);
                }
            }
        )
    }, []);

    function toggleFavourite() {
        if (favourite) {
            // Remove from favourites
            removeFavourite(currentUserId, props.panel.locationId,
                // onSuccess
                () => {setFavourite(false)},
                // onError
                console.error
            )
        } else {
            // Add to favourites
            addFavourite(currentUserId, props.panel.name, props.panel.locationId,
                // onSuccess
                () => {setFavourite(true)},
                // onError
                console.error
            )
        }
    }

    return (
        <ListItem.Accordion bottomDivider noIcon containerStyle={{ backgroundColor: colors.background }}
            content={
                <>
                    {
                        Platform.OS === "ios"
                            ? <Avatar size="small" rounded title={props.panel.avatar} containerStyle={{backgroundColor: '#b0b0b0'}} />
                            : <Avatar size="small" rounded title={props.panel.avatar} titleStyle={{ fontSize: 10}} containerStyle={{backgroundColor: '#b0b0b0'}} />
                    }

                    <ListItem.Content style={{ paddingLeft: 10 }}>
                        <ListItem.Title style={{ color: colors.text }}>{props.panel.name}</ListItem.Title>
                        <ListItem.Subtitle style={{ color: colors.text }}>{`Seats available: ${props.panel.seats}`}</ListItem.Subtitle>
                        <CrowdednessIndicator vacancyPercentage={props.panel.vacancyPercentage} />
                    </ListItem.Content>
                    <Ionicons name={favourite ? "heart" : "heart-outline"} size={30} color="red" onPress={toggleFavourite} />
                    <Ionicons name={alert ? "notifications" : "notifications-outline"} size={30} color="gold" onPress={() => setAlert(!alert)} />
                </>
            }
            isExpanded={expanded}
            onPress={() => setExpanded(!expanded)}
        >
            <ListItem bottomDivider containerStyle={{ backgroundColor: colors.background }}>
                {
                    Platform.OS === "ios"
                        ? (<ListItem.Content>
                            <ListItem.Title style={{ color: colors.text, textDecorationLine: 'underline', paddingTop: 10 }}>Additional Information</ListItem.Title>
                            
                            <CustomText text={"Floorplan (Coming soon in Milestone 3!)"} textStyle={{paddingVertical: 5, fontWeight: 'bold'}} />
                            <CustomText text={"Comments:"} textStyle={{paddingVertical: 5, fontWeight: 'bold'}} />
                            {
                                props.panel.comments.map((comment, index) => (
                                    <View key={index} style={{width: '100%'}}>
                                        <CustomText text={comment} />
                                        <View style={{height: 0.5, width: '100%', backgroundColor: "grey", marginVertical: 5}} />
                                    </View>
                                ))
                            }
                            <CustomText text={`Rating: ${props.panel.rating.toFixed(2)}/5 stars`} textStyle={{paddingVertical: 5, fontWeight: 'bold'}} />
        
                            <Button 
                                title="Report a faulty seat" 
                                titleStyle={{fontSize: 12}} 
                                buttonStyle={{backgroundColor: 'red'}} 
                                containerStyle={{alignSelf: 'center'}}
                                onPress={() => navigation.navigate("ReportFaultySeat")}
                            />
                        </ListItem.Content>)
                        : (<ListItem.Content>
                            <ListItem.Title style={{ color: colors.text, textDecorationLine: 'underline', paddingTop: 10, fontSize: 10 }}>Additional Information</ListItem.Title>
                            
                            <CustomText text={"Floorplan (Coming soon in Milestone 3!)"} textStyle={{paddingVertical: 5, fontWeight: 'bold', fontSize: 10}} />
                            <CustomText text={"Comments:"} textStyle={{paddingVertical: 5, fontWeight: 'bold', fontSize: 10}} />
                            {
                                props.panel.comments.map((comment, index) => (
                                    <View key={index} style={{width: '100%'}}>
                                        <CustomText text={comment} textStyle={{fontSize: 10}} />
                                        <View style={{height: 0.5, width: '100%', backgroundColor: "grey", marginVertical: 5}} />
                                    </View>
                                ))
                            }
                            <CustomText text={`Rating: ${props.panel.rating}/5 stars`} textStyle={{paddingVertical: 5, fontWeight: 'bold'}} />
        
                            <Button 
                                title="Report a faulty seat" 
                                titleStyle={{fontSize: 12}} 
                                buttonStyle={{backgroundColor: 'red'}} 
                                containerStyle={{alignSelf: 'center'}}
                                onPress={() => navigation.navigate("ReportFaultySeat")}
                            />
                        </ListItem.Content>)
                }
                {/* <ListItem.Content>
                    <ListItem.Title style={{ color: colors.text, textDecorationLine: 'underline', paddingTop: 10 }}>Additional Information</ListItem.Title>
                    
                    <CustomText text={"Floorplan (Coming soon in Milestone 3!)"} textStyle={{paddingVertical: 5, fontWeight: 'bold'}} />
                    <CustomText text={"Comments:"} textStyle={{paddingVertical: 5, fontWeight: 'bold'}} />
                    {
                        props.panel.comments.map((comment, index) => (
                            <View key={index} style={{width: '100%'}}>
                                <CustomText text={comment} />
                                <View style={{height: 0.5, width: '100%', backgroundColor: "grey", marginVertical: 5}} />
                            </View>
                        ))
                    }
                    <CustomText text={`Rating: ${props.panel.rating}/5 stars`} textStyle={{paddingVertical: 5, fontWeight: 'bold'}} />

                    <Button 
                        title="Report a faulty seat" 
                        titleStyle={{fontSize: 12}} 
                        buttonStyle={{backgroundColor: 'red'}} 
                        containerStyle={{alignSelf: 'center'}}
                        onPress={() => navigation.navigate("ReportFaultySeat")}
                    />
                </ListItem.Content> */}
            </ListItem>
        </ListItem.Accordion>
    );
}

const styles = StyleSheet.create({
    item: {
      backgroundColor: "#f9c2ff",
      padding: 20,
      marginVertical: 8
    },
    header: {
      fontSize: 32,
    },
    title: {
      fontSize: 24
    }
});