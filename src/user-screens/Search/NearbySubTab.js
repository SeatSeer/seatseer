import React, { useState, useCallback } from "react";
import Panel from "../../../misc_components/Panel";
import Screen from '../../../misc_components/Screen';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import { geoSearch } from "../../../backend/ElasticSearch";

/**
 * props contains 3 fields passed from the main Search tab
 * props.setMarkers
 * props.currentRegion
 * props.permission
 */
export default function NearbySubTab(props) {
    const [panels, setPanels] = useState(null);
    const isFocused = useIsFocused();

    /**
     * Checks whether the coordinates of the location retrieved from backend is within the current 
     */
    function isWithinBoundary({ _source: { location } }) {
        /** @todo Make the boundary coordinates the actual visible map view (top half) that is not blocked by the 3 sub-tabs. */
        const latLeftLimit = props.currentRegion.latitude - props.currentRegion.latitudeDelta;
        const latRightLimit = props.currentRegion.latitude + props.currentRegion.latitudeDelta;
        const lonLeftLimit = props.currentRegion.longitude - props.currentRegion.longitudeDelta;
        const lonRightLimit = props.currentRegion.longitude + props.currentRegion.longitudeDelta;
        const latitude = parseFloat(location.lat);
        const longitude = parseFloat(location.lon);
        return (latitude > latLeftLimit && latitude < latRightLimit
            && longitude > lonLeftLimit && longitude < lonRightLimit)
    }

    /**
     * Each time the Nearby sub-tab comes into focus and each time props.permission or props.currentRegion changes while the Nearby tab is focused,
     * we trigger a geo search where the centre of the map is used as the coordinates for the query.
     * The locations retrieved from ElasticSearch will be filtered to obtain locations currently visible to the user on the map.
     * Markers and panels are then updated using the filtered locations.
     * @todo Calculate the proper center of the map based on the visible part of the map.
     */
    useFocusEffect(
        useCallback(() => {
            // If the user has not indicated their location permissions yet, we do not make a query.
            if (props.permission !== null) {
                geoSearch(props.currentRegion.latitude, props.currentRegion.longitude,
                    // onSuccess callback
                    (results) => {
                        // Filter out all of the locations that are not visible in the current region
                        /** @todo Let backend handle the filtering, then use the methods defined in ElasticSearch.js to set markers and panels */
                        const visibleLocationsArray = results.hits.hits.filter(isWithinBoundary);
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
                        }));
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
                    },
                    // onFailure callback
                    console.error
                )
            }
        }, [props.permission, props.currentRegion])
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
