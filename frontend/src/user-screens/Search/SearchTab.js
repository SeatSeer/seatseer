import React from 'react';
import NearbySubTab from './NearbySubTab';
import FavouritesSubTab from './FavouritesSubTab';
import FilteredTextSearchSubTab from './FilteredTextSearchSubTab';
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
                if (route.name === 'NearbySubTab') {
                    iconName = focused
                        ? 'navigate'
                        : 'navigate-outline';
                } else if (route.name === 'FavouritesSubTab') {
                    iconName = focused
                        ? 'heart'
                        : 'heart-outline';
                } else if (route.name === 'FilteredTextSearchSubTab') {
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
        lazy={true}
        swipeEnabled={false}
        >
            <SearchScreenTabs.Screen name="NearbySubTab" children={() => <NearbySubTab setMarkers={props.setMarkers} currentRegion={props.currentRegion} permission={props.permission} />} />
            <SearchScreenTabs.Screen name="FavouritesSubTab" children={() => <FavouritesSubTab setMarkers={props.setMarkers} />} />
            <SearchScreenTabs.Screen name="FilteredTextSearchSubTab" children={() => <FilteredTextSearchSubTab setMarkers={props.setMarkers} />} />
        </SearchScreenTabs.Navigator>
    );
}