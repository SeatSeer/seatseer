import React, { useCallback, useState, useEffect } from "react";
import Panel from "../../../misc_components/Panel";
import Screen from '../../../misc_components/Screen';
import CustomText from "../../../misc_components/CustomText";
import { View, StyleSheet, ScrollView, Dimensions } from "react-native";
import * as Location from 'expo-location';
import { useFocusEffect } from '@react-navigation/native';

// const panels = [
//     {
//         name: 'Central Library Level 3',
//         avatar: 'CLB',
//         subtitle: 'Seats available:',
//         seats: 2,
//         crowdedness: 38/40,
//         coordinates: {
//             latitude: 1.2967379069474128,
//             longitude: 103.77323458888847
//         }
//     },
//     {
//         name: 'Central Library Level 4',
//         avatar: 'CLB',
//         subtitle: 'Seats available:',
//         seats: 0,
//         crowdedness: 40/40,
//         coordinates: {
//             latitude: 1.2967379069474128,
//             longitude: 103.77323458888847
//         }
//     },
//     {
//         name: 'Central Library Level 5',
//         avatar: 'CLB',
//         subtitle: 'Seats available:',
//         seats: 10,
//         crowdedness: 30/40,
//         coordinates: {
//             latitude: 1.2967379069474128,
//             longitude: 103.77323458888847
//         }
//     },
//     {
//         name: 'Central Library Level 6',
//         avatar: 'CLB',
//         subtitle: 'Seats available:',
//         seats: 5,
//         crowdedness: 35/40,
//         coordinates: {
//             latitude: 1.2967379069474128,
//             longitude: 103.77323458888847
//         }
//     },
//     {
//         name: 'E5',
//         avatar: 'E5',
//         subtitle: 'Seats available:',
//         seats: 15,
//         crowdedness: 20/35,
//         coordinates: {
//             latitude: 1.2980576217050053,
//             longitude: 103.77240415066122
//         }
//     },
// ]

export default function NearbyTab(props) {
    const [panels, setPanels] = useState(null);

    // useFocusEffect(() => {
    //     if (panels) {
    //         props.setMarkers(panels.map((panel, index) => {
    //             return {
    //                 title: panel.avatar,
    //                 description: panel.name,
    //                 coordinates: panel.coordinates
    //             }
    //         }))
    //     } else {
    //         props.setMarkers(null);
    //     }
    // })

    function isWithinBoundary(data) {
        const latLeftLimit = props.currentCoords.latitude - props.currentCoords.latitudeDelta;
        const latRightLimit = props.currentCoords.latitude + props.currentCoords.latitudeDelta;
        const lonLeftLimit = props.currentCoords.longitude - props.currentCoords.longitudeDelta;
        const lonRightLimit = props.currentCoords.longitude + props.currentCoords.longitudeDelta;
        const latitude = parseFloat(data._source.location.lat);
        const longitude = parseFloat(data._source.location.lon);
        return (latitude > latLeftLimit && latitude < latRightLimit
            && longitude > lonLeftLimit && longitude < lonRightLimit)
    }

    /**
     * When we first mount the Nearby tab, we request for the user's permission to use their location data,
     * then get their current coordinates and use them to search for locations near them.
     */
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                // Handle what to do when user doesn't allow location tracking
                return;
            } else {
                // let { coords } = await Location.getLastKnownPositionAsync({});
                const url = `http://44.194.92.99:9200/seats/_search`
                const body = {
                    "sort": [ {
                        "_geo_distance" : {
                            "location" : {
                                "lat" : props.currentCoords.latitude,
                                "lon" : props.currentCoords.longitude
                                // "lat" : coords.latitude,
                                // "lon" : coords.longitude
                            },
                            "order" : "asc",
                            "unit" : "km"
                        }
                    }],
                    "query": {
                        "match_all": {}
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
                    console.log(dataArray);
                    // Filter out all of the locations that are not visible in the current region
                    const visibleLocationsArray = dataArray.filter(isWithinBoundary);
                    // Set the markers on the map
                    props.setMarkers(visibleLocationsArray.map((data, index) => {
                        return {
                            title: data._source.avatar,
                            description: data._source.name,
                            coordinates: {
                                latitude: parseFloat(data._source.location.lat),
                                longitude: parseFloat(data._source.location.lon)
                            }
                        }
                    }))
                    // Set the panels in the nearby tab
                    setPanels(visibleLocationsArray.map((data, index) => {
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
            }
        })()
    }, [props.currentCoords]);

    return (
        <Screen scrollable={true}>
            {
                panels
                    ? panels.map((panel, index) => (
                        <Panel key={index} panel={panel} />
                    ))
                    : (<></>)
            }
        </Screen>
    );
}
