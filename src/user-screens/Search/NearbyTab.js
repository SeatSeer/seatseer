import React, { useState, useEffect, useRef } from "react";
import Panel from "../../../misc_components/Panel";
import Screen from '../../../misc_components/Screen';

/**
 * props contains 3 fields passed from the main search tab
 * props.setMarkers
 * props.currentRegion
 * props.permission
 */
export default function NearbyTab(props) {
    const [panels, setPanels] = useState(null);
    let isInitialMount = useRef(true);

    /**
     * Checks whether the coordinates of the location retrieved from backend is within the current 
     */
    function isWithinBoundary({ _source: { location } }) {       // Use this header to destructure the data and obtain the location object straight away
    // function isWithinBoundary(data) {
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
     * After the Nearby tab re-renders (not including initial mount), we trigger an effect if props.permission or props.currentRegion changes.
     * This effect will send a query to the backend to perform a location based search, returning a list of locations
     * in order of their proximity to the coordinates at the center of the screen.
     * After a successful query, the locations will be filtered to remove all locations that are not within props.currentRegion.
     * After that, data from those locations that remain will be used to:
     * a) Set the markers on the map
     * b) Set the panels in the Nearby tab
     */
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else if (props.permission) {
            const url = `http://44.194.92.99:9200/seats/_search`
            const body = {
                "sort": [ {
                    "_geo_distance" : {
                        "location" : {
                            "lat" : props.currentRegion.latitude,
                            "lon" : props.currentRegion.longitude
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
                // Filter out all of the locations that are not visible in the current region
                const visibleLocationsArray = dataArray.filter(isWithinBoundary);
                console.log(visibleLocationsArray);
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
        
    }, [props.currentRegion, props.permission]);

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
