import React from 'react';
import NearbyTab from './NearbyTab';
import FavouritesTab from './FavouritesTab';
import SearchTab from './SearchTab';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SearchScreenTabs = createMaterialTopTabNavigator();

export default function SearchTabs(props) {
    return (
        <SearchScreenTabs.Navigator
        initialRouteName="Nearby"
        screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color }) => {
                let iconName;
                if (route.name === 'NearbyTab') {
                    iconName = focused
                        ? 'navigate'
                        : 'navigate-outline';
                } else if (route.name === 'FavouritesTab') {
                    iconName = focused
                        ? 'heart'
                        : 'heart-outline';
                } else if (route.name === 'SearchTab') {
                    iconName = focused
                        ? 'search'
                        : 'search-outline';
                }
                return <Ionicons name={iconName} size={20} color={color} />;
            }
          })}
        tabBarOptions={{
            activeTintColor: 'tomato',
            inactiveTintColor: 'gray',
            showIcon: true,
            showLabel: false
        }}
        >
            <SearchScreenTabs.Screen name="NearbyTab" children={() => <NearbyTab setMarkers={props.setMarkers} currentCoords={props.currentCoords} permission={props.permission} />} />
            <SearchScreenTabs.Screen name="FavouritesTab" children={() => <FavouritesTab setMarkers={props.setMarkers} />} />
            <SearchScreenTabs.Screen name="SearchTab" children={() => <SearchTab setMarkers={props.setMarkers} />} />
        </SearchScreenTabs.Navigator>
    );
}