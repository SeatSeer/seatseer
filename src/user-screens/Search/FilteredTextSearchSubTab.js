import React, { useState, useRef, useReducer, useCallback } from 'react';
import Screen from '../../../misc_components/Screen';
import CustomText from '../../../misc_components/CustomText';
import Panel from "../../../misc_components/Panel";
import { FlatList, StyleSheet, TextInput, View, ScrollView, Keyboard, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useIsFocused, useFocusEffect, useTheme } from '@react-navigation/native';
import { CheckBox, Slider, Overlay, Button } from 'react-native-elements';
import { filteredTextSearch, transformToPanels, filterLetters } from '../../../backend/ElasticSearch';

const initialFilterState = {
    "aircon": false,
    "wifi": false,
    "lessCrowded": false,
    "lessNoisy": false,
    "snacksAndDrinksNearby": false,
    "powerPlugs": false,
    "natureView": false,
    "cityView": false,
    "nearToMrt": false,
    "minRating": 0,
    "seatingSize": 1
}

function reducer(state, action) {
    switch (action.type) {
        case 'toggleAircon':
            return { ...state, "aircon": !state["aircon"] };
        case 'toggleWifi':
            return { ...state, "wifi": !state["wifi"] };
        case 'toggleLessCrowd':
            return { ...state, "lessCrowded": !state["lessCrowded"] };
        case 'toggleLessNoise':
            return { ...state, "lessNoisy": !state["lessNoisy"] };
        case 'toggleSnacksAndDrinks':
            return { ...state, "snacksAndDrinksNearby": !state["snacksAndDrinksNearby"] };
        case 'togglePlugs':
            return { ...state, "powerPlugs": !state["powerPlugs"] };
        case 'toggleNatureView':
            return { ...state, "natureView": !state["natureView"] };
        case 'toggleCityView':
            return { ...state, "cityView": !state["cityView"] };
        case 'toggleNearToMrt':
            return { ...state, "nearToMrt": !state["nearToMrt"] };
        case 'toggleMinRating':
            return { ...state, "minRating": action.payload };
        case 'toggleSeatingSize':
            return { ...state, "seatingSize": action.payload };
        default:
            return;
    }
}

export default function FilteredTextSearchSubTab(props) {
    const [query, setQuery] = useState('');
    const searchBox = useRef(null);
    const [panels, setPanels] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [fromIndex, setFromIndex] = useState(0);
    const [size, setSize] = useState(10);
    const [filtersAreVisible, setFiltersAreVisible] = useState(false);
    const [state, dispatch] = useReducer(reducer, initialFilterState);
    const isFocused = useIsFocused();
    const { dark, colors } = useTheme();

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

    function handleQuery() {
        setFiltersAreVisible(false);
        Keyboard.dismiss();
        // Here, we create the rating and seatingSize filters first, then we concatenate all the filters that the user has selected
        // by filtering out all the filters that are false, then mapping them into the correct format
        const filters = [
            { "range": { "rating": { "gte": state["minRating"] } } },
            { "range": { "seatingSize": { "gte": state["seatingSize"] } } }]
            .concat(
                Object.entries(state)
                .filter(entry => entry[1] === true)
                .map(entry => {
                    return { "term": { "features": filterLetters[entry[0]] } }
                })
            );
        filteredTextSearch(query, filters, 0, 10,
            // onSuccess callback
            (results) => {
                // Set the panels in the search tab
                setPanels(transformToPanels(results));
                setFromIndex(10);
                setSize(10);
            },
            // onFailure callback
            console.error
        )
    }

    /** When the user pulls down on the list, it will refresh to update all the data on the locations. */
    function handleRefresh() {
        setIsRefreshing(true);
        const filters = [
            { "range": { "rating": { "gte": state["minRating"] } } },
            { "range": { "seatingSize": { "gte": state["seatingSize"] } } }]
            .concat(
                Object.entries(state)
                .filter(entry => entry[1] === true)
                .map(entry => {
                    return { "term": { "features": filterLetters[entry[0]] } }
                })
            );
        filteredTextSearch(query, filters, 0, size,
            // onSuccess callback
            (results) => {
                // Set the panels in the nearby tab
                setPanels(transformToPanels(results));
                setIsRefreshing(false);
            },
            // onFailure callback
            console.error
        )
    }

    function handleOnEndReached() {
        const filters = [
            { "range": { "rating": { "gte": state["minRating"] } } },
            { "range": { "seatingSize": { "gte": state["seatingSize"] } } }]
            .concat(
                Object.entries(state)
                .filter(entry => entry[1] === true)
                .map(entry => {
                    return { "term": { "features": filterLetters[entry[0]] } }
                })
            );
        filteredTextSearch(query, filters, fromIndex, 10,
            // onSuccess callback
            (results) => {
                const newPanels = panels.concat(transformToPanels(results));
                setPanels(newPanels);
                setFromIndex(fromIndex + 10);
                setSize(size + 10);
            },
            // onFailure callback
            console.error
        )
    }

    function toggleFilterOverlay() {
        setFiltersAreVisible(!filtersAreVisible);
    }

    const renderPanel = ({ item, index, separators }) => {
        return (
            <Panel data={item} handleRefresh={handleRefresh} />
        );
    }

    return (
        <Screen>
            <View style={styles.search_bar}>
                <Ionicons name="search" size={20} color="grey" />
                <TextInput
                    style={styles.search_bar_text_input}
                    placeholder="Search for seat locations"
                    placeholderTextColor="#888888"
                    onChangeText={setQuery}
                    ref={searchBox}
                    onSubmitEditing={handleQuery}
                    returnKeyType="search"
                />
                <Button title="Filters" titleStyle={{fontSize: 12}} containerStyle={{marginLeft: 'auto'}} onPress={toggleFilterOverlay} />
            </View>

            <Overlay isVisible={filtersAreVisible} onBackdropPress={toggleFilterOverlay} overlayStyle={{backgroundColor: colors.background, width: width, height: 0.8 * height, padding: 0, borderRadius: 10}}>
                <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: colors.card, borderTopLeftRadius: 10, borderTopRightRadius: 10, paddingVertical: 5}}>
                    <Button 
                        title="Back"
                        type="clear"
                        icon={<Ionicons name="chevron-back" size={20} color="dodgerblue" />}
                        titleStyle={{fontSize: 17}}
                        onPress={toggleFilterOverlay}
                        containerStyle={{flex: 1}}
                        buttonStyle={{alignSelf: 'flex-start'}}
                    />
                    <CustomText text={"Filters"} textStyle={{fontWeight: 'bold', fontSize: 20, textAlign: 'center'}} />
                    <View style={{flex: 1}} />
                </View>

                <View style={{height: 0.5, width: '100%', backgroundColor: "grey", marginBottom: 5}} />

                <ScrollView style={{paddingHorizontal: 10}}>
                    <CustomText text={"Choose your filters:"} />
                    <CheckBox title="Air con" checked={state["aircon"]} onPress={() => dispatch({ type: 'toggleAircon' })} textStyle={{color: colors.text}} containerStyle={{backgroundColor: colors.background}} />
                    <CheckBox title="Wifi" checked={state["wifi"]} onPress={() => dispatch({ type: 'toggleWifi' })} textStyle={{color: colors.text}} containerStyle={{backgroundColor: colors.background}} />
                    <CheckBox title="Less crowded" checked={state["lessCrowded"]} onPress={() => dispatch({ type: 'toggleLessCrowd' })} textStyle={{color: colors.text}} containerStyle={{backgroundColor: colors.background}} />
                    <CheckBox title="Less noisy" checked={state["lessNoisy"]} onPress={() => dispatch({ type: 'toggleLessNoise' })} textStyle={{color: colors.text}} containerStyle={{backgroundColor: colors.background}} />
                    <CheckBox title="Snacks and drinks nearby" checked={state["snacksAndDrinksNearby"]} onPress={() => dispatch({ type: 'toggleSnacksAndDrinks' })} textStyle={{color: colors.text}} containerStyle={{backgroundColor: colors.background}} />
                    <CheckBox title="Power plugs" checked={state["powerPlugs"]} onPress={() => dispatch({ type: 'togglePlugs' })} textStyle={{color: colors.text}} containerStyle={{backgroundColor: colors.background}} />
                    <CheckBox title="Nature view" checked={state["natureView"]} onPress={() => dispatch({ type: 'toggleNatureView' })} textStyle={{color: colors.text}} containerStyle={{backgroundColor: colors.background}} />
                    <CheckBox title="City view" checked={state["cityView"]} onPress={() => dispatch({ type: 'toggleCityView' })} textStyle={{color: colors.text}} containerStyle={{backgroundColor: colors.background}} />
                    <CheckBox title="Near to MRT" checked={state["nearToMrt"]} onPress={() => dispatch({ type: 'toggleNearToMrt' })} textStyle={{color: colors.text}} containerStyle={{backgroundColor: colors.background}} />
                    <CustomText text={`Minimum seat rating: ${state["minRating"].toFixed(2)}`} textStyle={{fontWeight: 'bold', padding: 10}} />
                    <Slider
                        value={state["minRating"]}
                        onValueChange={(newValue) => {dispatch({ type: 'toggleMinRating', payload: newValue });}}
                        maximumValue={5}
                        minimumValue={0}
                        step={0.01}
                        thumbStyle={{width: 30, height: 30}}
                        maximumTrackTintColor={dark ? '#5a5a5a' : '#b3b3b3'}
                        minimumTrackTintColor={dark ? '#b3b3b3' : '#3f3f3f'}
                    />
                    <CustomText text={`Minimum seating size: ${state["seatingSize"]}`} textStyle={{fontWeight: 'bold', padding: 10}} />
                    <Slider
                        value={state["seatingSize"]}
                        onValueChange={(newValue) => {dispatch({ type: 'toggleSeatingSize', payload: newValue });}}
                        maximumValue={8}
                        minimumValue={1}
                        step={1}
                        thumbStyle={{width: 30, height: 30}}
                        maximumTrackTintColor={dark ? '#5a5a5a' : '#b3b3b3'}
                        minimumTrackTintColor={dark ? '#b3b3b3' : '#3f3f3f'}
                    />
                    <Button title="Search" titleStyle={{fontSize: 12}} containerStyle={{paddingVertical: 15}} onPress={handleQuery} />
                </ScrollView>
            </Overlay>

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
        </Screen>
    );
}

const { width, height } = Dimensions.get("window")

const styles = StyleSheet.create({
    search_bar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: "#dbd6d2",
        paddingHorizontal: 10,
        borderBottomColor: 'grey'
    },

    search_bar_text_input: {
        height: 45,
        width: "75%",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "left",
        paddingLeft: 10
    }
})