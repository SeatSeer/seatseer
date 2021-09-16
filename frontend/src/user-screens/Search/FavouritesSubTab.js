import React, { useState, useCallback, useEffect } from "react";
import { FlatList, StyleSheet } from "react-native";
import Screen from '../../../misc_components/Screen';
import Panel from "../../../misc_components/Panel";
import { useSelector } from "react-redux";
import { subscribeToFavouritesChanges } from "../../../api/rtdb";
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import { idSearch, transformToPanels } from "../../../backend/ElasticSearch";

export default function FavouritesSubTab(props) {
    const [panels, setPanels] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const currentUserId = useSelector((state) => state.auth.currentUserId);
    const isFocused = useIsFocused();

    function handleRefresh() {
        setIsRefreshing(true);
        idSearch(panels.map((panel, index) => panel.id),
            // onSuccess callback
            (results) => {
                // Set the panels in the nearby tab
                setPanels(transformToPanels(results));
                setIsRefreshing(false);
            },
            // onFailure callback
            console.error
        )
    }

    /**
     * Each time the Favourites sub-tab comes into focus, we subscribe to changes in Firebase Realtime Database at the favourites section of the user.
     * Everytime a user's favourites change, we obtain the IDs of the locations in the favourites section of the user in Firebase Realtime Database,
     * and perform a search to retrieve these locations' details from ElasticSearch.
     * Markers and panels are then re-mapped with the info retrieved so that they show the user's most recent favourites.
     * When the Favourites tab is out of focus (blurred), we unsubscribe from Firebase Realtime Database.
     */
    useEffect(() => {
        return subscribeToFavouritesChanges(currentUserId,
            // onValueChanged callback
            (locations) => {
                // locations is in the form { locationId1: locationName1, locationId2: locationName2, ... }
                if (locations) {
                    idSearch(Object.keys(locations),
                        // onSuccess callback
                        (results) => {
                            // Set the panels in the favourites tab
                            setPanels(transformToPanels(results));
                        },
                        // onFailure callback
                        console.error
                    );
                } else {
                    setPanels([]);
                }
            }
        )
    }, []);

    /**
     * Set the markers on the map only when this tab is in focus, and everytime the panels on this map change
     */
    useFocusEffect(
        useCallback(() => {
            props.setMarkers(panels.map((panel, index) => {
                return {
                    title: panel.id,
                    description: panel.name,
                    coordinates: {
                        latitude: panel.coordinates.latitude,
                        longitude: panel.coordinates.longitude
                    }
                }
            }));
        }, [panels])
    );

    const renderPanel = ({ item, index, separators }) => {
        return (
            <Panel data={item} handleRefresh={handleRefresh} />
        );
    }

    return (
        <Screen>
            {
                isFocused && 
                <FlatList
                    refreshing={isRefreshing}
                    onRefresh={handleRefresh}
                    data={panels}
                    renderItem={renderPanel}
                    keyExtractor={(item, index) => item.id}
                />
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