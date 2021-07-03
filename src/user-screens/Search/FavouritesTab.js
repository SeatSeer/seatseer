import React, { useState, useCallback } from "react";
import { StyleSheet } from "react-native";
import Screen from '../../../misc_components/Screen';
import Panel from "../../../misc_components/Panel";
import { useSelector } from "react-redux";
import { subscribeToFavouritesChanges } from "../../../api/rtdb";
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import { idSearch, transformToMarkers, transformToPanels } from "../../../backend/ElasticSearch";

export default function FavouritesTab(props) {
    const [panels, setPanels] = useState(null);
    const currentUserId = useSelector((state) => state.auth.currentUserId);
    const isFocused = useIsFocused();

    /**
     * Each time the Favourites sub-tab comes into focus, we subscribe to changes in Firebase Realtime Database at the favourites section of the user.
     * Everytime a user's favourites change, we obtain the IDs of the locations in the favourites section of the user in Firebase Realtime Database,
     * and perform a search to retrieve these locations' details from ElasticSearch.
     * Markers and panels are then re-mapped with the info retrieved so that they show the user's most recent favourites.
     * When the Favourites tab is out of focus (blurred), we unsubscribe from Firebase Realtime Database.
     */
    useFocusEffect(
        useCallback(() => {
            return subscribeToFavouritesChanges(currentUserId,
                // onValueChanged callback
                (locations) => {
                    // locations is in the form { locationId1: locationName1, locationId2, locationName2, ... }
                    if (locations) {
                        idSearch(Object.keys(locations),
                            // onSuccess callback
                            (results) => {
                                // Set the markers on the map
                                props.setMarkers(transformToMarkers(results));
                                // Set the panels in the favourites tab
                                setPanels(transformToPanels(results));
                            },
                            // onFailure callback
                            console.error
                        )
                    } else {
                        props.setMarkers(null);
                        setPanels(null);
                    }
                }
            )
        }, [])
    );
    
    return (
        <Screen scrollable={true}>
            {
                isFocused && panels
                    ? panels.map((panel, index) => (
                        <Panel key={index} panel={panel} />
                    ))
                    : (<></>)
            }
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
})