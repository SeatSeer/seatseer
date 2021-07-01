import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import Screen from '../../../misc_components/Screen';
import Panel from "../../../misc_components/Panel";
import { useSelector } from "react-redux";
import { subscribeToFavouritesChanges } from "../../../api/rtdb";
import { useIsFocused } from '@react-navigation/native';

export default function FavouritesTab(props) {
    const [panels, setPanels] = useState(null);
    const currentUserId = useSelector((state) => state.auth.currentUserId);
    const isFocused = useIsFocused();

    /**
     * On mounting the Favourites tab, we subscribe to changes in Firebase Realtime Database at the favourites section of the user.
     * Everytime a user's favourites change, re-map the panels so that they show the user's most recent favourites.
     */
    useEffect(() => {
        return subscribeToFavouritesChanges(currentUserId,
            // onValueChanged callback
            (locations) => {
                // locations is in the form { locationId1: locationName1, locationId2, locationName2, ... }
                if (locations) {
                    const url = `http://44.194.92.99:9200/seats/_search`
                    const body = {
                        "query": {
                            "terms": {
                                "ID": Object.keys(locations)
                            }
                        }
                    }
                    const otherParams = {
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(body),
                        method: "POST"
                    }
                    fetch(url, otherParams).then(res => res.json())
                    .then(({ hits }) => {
                        const dataArray = hits.hits;
                        // console.log(dataArray);
                        setPanels(dataArray.map((data, index) => {
                            return {
                                locationId: data._source.ID,
                                name: data._source.name,
                                avatar: data._source.avatar,
                                seats: data._source.vacant_seats,
                                vacancyPercentage: data._source.vacant_seats / data._source.total_seats,
                                coordinates: {
                                    latitude: parseFloat(data._source.location.lat),
                                    longitude: parseFloat(data._source.location.lon)
                                },
                                rating: data._source.rating_total / data._source.rating_number,
                                comments: data._source.comments
                            }
                        }));
                    })
                    .catch(console.error);
                } else {
                    setPanels(null);
                }
            }
        )
    }, []);
    
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