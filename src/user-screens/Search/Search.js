import React, { useState, useEffect, useRef } from 'react';
import { TouchableOpacity, StyleSheet, View, Dimensions, Platform, Alert } from 'react-native';
import Screen from '../../../misc_components/Screen';
import MapView, { Marker } from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Avatar } from 'react-native-elements';
import SearchTab from './SearchTab';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { requestForegroundPermissionsAsync, getLastKnownPositionAsync } from 'expo-location';

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
    const [markers, setMarkers] = useState([]);
    const [currentRegion, setCurrentRegion] = useState(nusRegion);
    const [permission, setPermission] = useState(null);
    const [isAtMyLocation, setIsAtMyLocation] = useState(false);
    let mapRef = useRef(null);

    /**
     * Upon mounting the Search tab, the app will ask the user for permission to access their location.
     * If the user disagrees, the map will remain in its default inital region, NUS.
     * Else if the user agrees, the map will animate to their last known location and load all nearby areas as markers and panels
     * in the nearby tab.
     */
    useEffect(() => {
        (async () => {
            let { status } = await requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setPermission(false);
                Alert.alert(
                    "Location services denied",
                    "SeatSeer will not be able to access your location. You can always change this in your device's settings.",
                    [{ text: "OK" }],
                    { cancelable: true }
                )
            } else {
                try {
                    let { coords } = await getLastKnownPositionAsync({});
                    const mapRegion = {
                        latitude: coords.latitude,
                        latitudeDelta: 0.0122,
                        longitude: coords.longitude,
                        longitudeDelta: 0.0121
                    }
                    mapRef.current.animateToRegion(mapRegion, 10);
                    setCurrentRegion(mapRegion);
                    setPermission(true);
                    setIsAtMyLocation(true);
                } catch (error) {
                    setCurrentRegion(nusRegion);
                    setPermission(true);
                    setIsAtMyLocation(false);
                }
            }
        })()
    }, []);

    async function handleGoToMyLocation() {
        if (permission) {
            try {
                setIsAtMyLocation(true);
                let { coords } = await getLastKnownPositionAsync({});
                const mapRegion = {
                    latitude: coords.latitude,
                    latitudeDelta: currentRegion.latitudeDelta,
                    longitude: coords.longitude,
                    longitudeDelta: currentRegion.longitudeDelta
                }
                mapRef.current.animateToRegion(mapRegion, 10);
                setCurrentRegion(mapRegion);
            } catch (error) {
                Alert.alert(
                    "Oops, something went wrong!",
                    "We are unable to obtain your last known position.",
                    [{ text: "OK" }],
                    { cancelable: true }
                )
            }
        } else {
            // Alert the user that to use this feature, they have to give the app permission to access their location
            Alert.alert(
                "Access to location denied",
                "To use this button, please allow SeatSeer to access your location.",
                [{ text: "OK" }],
                { cancelable: true }
            )
        }
    }

    return (
        <Screen screenStyle={styles.container}>
            <MapView
                ref={mapRef}
                style={{flex: 1, height: 0.4 * height, width: width, position: 'absolute', left: 0, top: 0}}
                provider="google"
                initialRegion={nusRegion}
                showsUserLocation={true}
                onRegionChangeComplete={(region) => setCurrentRegion(region)}
                onPanDrag={() => setIsAtMyLocation(false)}
            >
                <Marker key={`key_${currentRegion.longitude}_${currentRegion.latitude}`} coordinate={{latitude: currentRegion.latitude, longitude: currentRegion.longitude}} />
                {
                    markers.length 
                        ? markers.map((marker, index) => (
                            <Marker
                                key={`key_${marker.coordinates.longitude}_${marker.coordinates.latitude}`}
                                coordinate={marker.coordinates}
                                title={marker.title}
                                description={marker.description}
                            >
                            {
                                Platform.OS === "ios"
                                    ? <Avatar size="small" rounded title={marker.title} containerStyle={{backgroundColor: '#b0b0b0'}} />
                                    : <Avatar size="small" rounded title={marker.title} titleStyle={{ fontSize: 10 }} containerStyle={{backgroundColor: '#b0b0b0'}} />
                            }
                            </Marker>
                        ))
                        : (<></>)
                }
            </MapView>

            <TouchableOpacity style={{ ...styles.my_location_button, bottom: 0.6 * height + 5, right: 5 }} onPress={handleGoToMyLocation}>
                <Ionicons name={isAtMyLocation ? "location" : "location-outline"} size={30} color='tomato' />
            </TouchableOpacity>

            <View style={{ ...styles.search_tabs, height: 0.6 * height, bottom: 0 }}>
                <SearchTab setMarkers={setMarkers} currentRegion={currentRegion} permission={permission} />
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
        width: '100%',
        position: 'absolute',
    },

    my_location_button: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        height: 50,
        borderRadius: 100,
        backgroundColor: 'white',
        position: 'absolute'
    }
});