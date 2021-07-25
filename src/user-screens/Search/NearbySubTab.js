import React, { useState, useCallback } from "react";
import { FlatList } from "react-native";
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
    const [panels, setPanels] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [fromIndex, setFromIndex] = useState(0);
    const [size, setSize] = useState(10);
    const isFocused = useIsFocused();

    /**
     * Checks whether the coordinates of the location retrieved from backend is within the current 
     */
    function isWithinBoundary({ _source: { location } }) {
        const modifiedLatitudeDelta = props.currentRegion.latitudeDelta / 4;
        const latLeftLimit = props.currentRegion.latitude - modifiedLatitudeDelta;
        const latRightLimit = props.currentRegion.latitude + modifiedLatitudeDelta;
        const modifiedLongitudeDelta = props.currentRegion.longitudeDelta / 3;
        const lonLeftLimit = props.currentRegion.longitude - modifiedLongitudeDelta;
        const lonRightLimit = props.currentRegion.longitude + modifiedLongitudeDelta;
        const latitude = parseFloat(location.lat);
        const longitude = parseFloat(location.lon);
        return (latitude > latLeftLimit && latitude < latRightLimit
            && longitude > lonLeftLimit && longitude < lonRightLimit)
    }

    /** When the user pulls down on the list, it will refresh to update all the data on the locations. */
    function handleRefresh() {
        setIsRefreshing(true);
        geoSearch(props.currentRegion.latitude, props.currentRegion.longitude, 0, size,
            // onSuccess callback
            (results) => {
                // Filter out all of the locations that are not visible in the current region
                const visibleLocationsArray = results.hits.hits.filter(isWithinBoundary);
                // Set the panels in the nearby tab
                setPanels(visibleLocationsArray.map((data, index) => {
                    return {
                        id: data._source.ID,
                        name: data._source.name,
                        seats: data._source.vacant,
                        vacancyPercentage: data._source.vacant / data._source.total,
                        coordinates: {
                            latitude: parseFloat(data._source.location.lat),
                            longitude: parseFloat(data._source.location.lon)
                        },
                        rating: data._source.rating,
                        ratingInfo: data._source.ratingInfo,
                        comments: data._source.comments,
                        filters: data._source.features,
                        seatingSize: data._source.seatingSize,
                    }
                }));
                setIsRefreshing(false);
            },
            // onFailure callback
            console.error
        )
    }

    function handleOnEndReached() {
        // Only load up to a maximum of 20 results
        if (size <= 10) {
            geoSearch(props.currentRegion.latitude, props.currentRegion.longitude, fromIndex, 10,
                // onSuccess callback
                (results) => {
                    // Filter out all of the locations that are not visible in the current region
                    const visibleLocationsArray = results.hits.hits.filter(isWithinBoundary);
                    // Set the panels in the nearby tab
                    const newPanels = panels.concat(
                        visibleLocationsArray.map((data, index) => {
                            return {
                                id: data._source.ID,
                                name: data._source.name,
                                seats: data._source.vacant,
                                vacancyPercentage: data._source.vacant / data._source.total,
                                coordinates: {
                                    latitude: parseFloat(data._source.location.lat),
                                    longitude: parseFloat(data._source.location.lon)
                                },
                                rating: data._source.rating,
                                ratingInfo: data._source.ratingInfo,
                                comments: data._source.comments,
                                filters: data._source.features,
                                seatingSize: data._source.seatingSize,
                            }
                        })
                    );
                    setPanels(newPanels);
                    setFromIndex(fromIndex + 10);
                    setSize(size + 10);
                },
                // onFailure callback
                console.error
            )
        }
    }

    /**
     * Each time the Nearby sub-tab comes into focus and each time props.permission or props.currentRegion changes while the Nearby tab is focused,
     * we trigger a geo search where the centre of the map is used as the coordinates for the query.
     * The locations retrieved from ElasticSearch will be filtered to obtain locations currently visible to the user on the map.
     * Markers and panels are then updated using the filtered locations.
     */
    useFocusEffect(
        useCallback(() => {
            // If the user has not indicated their location permissions yet, we do not make a query.
            if (props.permission !== null) {
                geoSearch(props.currentRegion.latitude, props.currentRegion.longitude, 0, 10,
                    // onSuccess callback
                    (results) => {
                        // Filter out all of the locations that are not visible in the current region
                        const visibleLocationsArray = results.hits.hits.filter(isWithinBoundary);
                        // Set the panels in the nearby tab
                        setPanels(visibleLocationsArray.map((data, index) => {
                            return {
                                id: data._source.ID,
                                name: data._source.name,
                                seats: data._source.vacant,
                                vacancyPercentage: data._source.vacant / data._source.total,
                                coordinates: {
                                    latitude: parseFloat(data._source.location.lat),
                                    longitude: parseFloat(data._source.location.lon)
                                },
                                rating: data._source.rating,
                                ratingInfo: data._source.ratingInfo,
                                comments: data._source.comments,
                                filters: data._source.features,
                                seatingSize: data._source.seatingSize,
                            }
                        }));
                        setFromIndex(10);
                        setSize(10);
                    },
                    // onFailure callback
                    console.error
                )
            }
        }, [props.permission, props.currentRegion])
    );

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
                    onEndReached={handleOnEndReached}
                    onEndReachedThreshold={1}
                    data={panels}
                    renderItem={renderPanel}
                    keyExtractor={(item, index) => item.id} 
                />
            }
        </Screen>
    );
}
