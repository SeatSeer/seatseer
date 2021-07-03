import React, { useState, useEffect, useRef } from 'react';
import Screen from '../../../misc_components/Screen';
import MapView, { Marker } from 'react-native-maps';
import SearchTabs from './SearchTabs';
import { StyleSheet, View, Dimensions, Platform } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import * as Location from 'expo-location';

const nusRegion = {
    latitude: 1.297,
    longitude: 103.7763,
    latitudeDelta: 0.0122,
    longitudeDelta: 0.0121
}

export default function Search() {
    const bottomTabBarHeight = useBottomTabBarHeight();
    const { width, height } = Dimensions.get('window');
    // Markers will be an array of objects with title and coordinates fields
    const [markers, setMarkers] = useState(null);
    const [currentRegion, setCurrentRegion] = useState(nusRegion);
    const [permission, setPermission] = useState(null);
    let mapRef = useRef(null);

    /**
     * Upon mounting the Search tab, the app will ask the user for permission to access their location.
     * If the user disagrees, the map will remain in its default inital region, NUS.
     * Else if the user agrees, the map will animate to their last known location and load all nearby areas as markers and panels
     * in the nearby tab.
     */
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setPermission(false);
            } else {
                let { coords } = await Location.getLastKnownPositionAsync({});
                const mapRegion = {
                    latitude: coords.latitude,
                    latitudeDelta: 0.0122,
                    longitude: coords.longitude,
                    longitudeDelta: 0.0121
                }
                mapRef.current.animateToRegion(mapRegion, 10);
                setCurrentRegion(mapRegion);
                setPermission(true);
            }
        })()
    }, []);

    return (
        <Screen screenStyle={styles.container}>
            <MapView
                ref={mapRef}
                style={{flex: 1, height: height - bottomTabBarHeight, width: width, position: 'absolute'}}
                mapPadding={{ bottom: 3 * height / 5 - bottomTabBarHeight }}
                provider="google"
                initialRegion={nusRegion}
                showsUserLocation={true}
                showsMyLocationButton={true}
                onRegionChangeComplete={(region) => setCurrentRegion(region)}
            >
                {
                    markers
                        ? markers.map((marker, index) => (
                            <Marker key={`key_${marker.coordinates.longitude}_${marker.coordinates.latitude}`} coordinate={marker.coordinates} title={marker.title} description={marker.description} />
                        ))
                        : (<></>)
                }
            </MapView>

            <View style={{ ...styles.search_tabs, height: 3 * height / 5 - bottomTabBarHeight, bottom: 0 }}>
                <SearchTabs setMarkers={setMarkers} currentRegion={currentRegion} permission={permission} />
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },

    search_tabs: {
        width: '95%',
        position: 'absolute',
    }
});