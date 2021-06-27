import React, { useState } from 'react';
import Screen from '../../../misc_components/Screen';
// import CustomText from '../../misc_components/CustomText';
import DissmissKeyboard from '../../../misc_components/DismissKeyboard';
import MapView, { Marker } from 'react-native-maps';
import SearchTabs from './SearchTabs';
import { StyleSheet, View, Dimensions } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

export default function Search() {
    const bottomTabBarHeight = useBottomTabBarHeight();
    const { width, height } = Dimensions.get('window');
    // Markers will be an array of objects with title and coordinates fields
    const [markers, setMarkers] = useState(null);
    const [currentCoords, setCurrentCoords] = useState({});

    function updateMarkers() {

    }

    function handleMapRegionChange(region) {
        // Pass down the region's coordinates to nearby tab
        console.log(region);
        setCurrentCoords(region);
    }

    return (
        <Screen screenStyle={styles.container}>
            <MapView
                style={{flex: 1, height: height - bottomTabBarHeight, width: width, position: 'absolute'}}
                mapPadding={{ bottom: 3 * height / 5 - bottomTabBarHeight }}
                provider="google"
                initialRegion={{
                    latitude: 1.297,
                    longitude: 103.7763,
                    latitudeDelta: 0.0122,
                    longitudeDelta: 0.0121,
                }}
                showsUserLocation={true}
                showsMyLocationButton={true}
                onRegionChangeComplete={handleMapRegionChange}
            >
                {
                    markers
                        ? markers.map((marker, index) => (
                            <Marker key={index} coordinate={marker.coordinates} title={marker.title} description={marker.description} />
                        ))
                        : (<></>)
                }
            </MapView>
            <View style={{ ...styles.search_tabs, height: 3 * height / 5 - bottomTabBarHeight, bottom: 0 }}>
                <SearchTabs setMarkers={setMarkers} currentCoords={currentCoords} />
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