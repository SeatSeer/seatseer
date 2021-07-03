import React, { useState, useRef, useReducer, useCallback } from 'react';
import Screen from '../../../misc_components/Screen';
import CustomText from '../../../misc_components/CustomText';
import Panel from "../../../misc_components/Panel";
import { StyleSheet, TextInput, View, Keyboard, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import { Button, CheckBox, Slider, Overlay } from 'react-native-elements';
import { filteredTextSearch, transformToMarkers, transformToPanels } from '../../../backend/ElasticSearch';

const initialFilterState = {
    "aircon": false,
    "less_noise": false,
    "less_crowd": false,
    "plugs": false,
    "snack&drink": false,
    "wifi": false,
    "minRating": 0
}

function reducer(state, action) {
    switch (action.type) {
        case 'toggleAircon':
            return { ...state, "aircon": !state["aircon"] };
        case 'toggleLessNoise':
            return { ...state, "less_noise": !state["less_noise"] };
        case 'toggleLessCrowd':
            return { ...state, "less_crowd": !state["less_crowd"] };
        case 'togglePlugs':
            return { ...state, "plugs": !state["plugs"] };
        case 'toggleSnacksAndDrinks':
            return { ...state, "snack&drink": !state["snack&drink"] };
        case 'toggleWifi':
            return { ...state, "wifi": !state["wifi"] };
        case 'toggleMinRating':
            return { ...state, "minRating": action.payload };
        default:
            return;
    }
}

export default function SearchTab(props) {
    const [query, setQuery] = useState('');
    const searchBox = useRef(null);
    const [panels, setPanels] = useState(null);
    const [filtersAreVisible, setFiltersAreVisible] = useState(false);
    const [state, dispatch] = useReducer(reducer, initialFilterState);
    const isFocused = useIsFocused();

    // useFocusEffect(useCallback(() => {
    //     /** @todo Fix bug where keyboard keeps popping up after search result is submitted */
    //     searchBox.current.focus();
    //     return () => searchBox.current.blur();
    // }))

    /**
     * Each time the Search sub-tab comes into focus, we update the markers to reflect whatever panels were shown in the Search sub-tab most recently.
     */
    useFocusEffect(
        useCallback(() => {
            if (panels !== null) {
                props.setMarkers(panels.map((panel, index) => {
                    return {
                        title: panel.avatar,
                        description: panel.name,
                        coordinates: {
                            latitude: panel.coordinates.latitude,
                            longitude: panel.coordinates.longitude
                        }
                    }
                }));
            } else {
                props.setMarkers(null);
            }
        }, [panels])
    );

    function handleQuery() {
        Keyboard.dismiss();
        setFiltersAreVisible(false);

        // Here, we create the rating filter first, then we concatenate all the filters that the user has selected
        // by filtering out all the filters that are false, then mapping them into the correct format
        const filters = [{ "range": { "rating": { "gte": state["minRating"] } } }].concat(
            Object.entries(state)
            .filter(entry => entry[1] === true)
            .map(entry => {
                return { "term": { "features": entry[0] } }
            })
        );
        filteredTextSearch(query, filters,
            // onSuccess callback
            (results) => {
                // Set the markers on the map
                props.setMarkers(transformToMarkers(results));
                // Set the panels in the search tab
                setPanels(transformToPanels(results));
            },
            // onFailure callback
            console.error
        )
    }

    function toggleFilterOverlay() {
        setFiltersAreVisible(!filtersAreVisible);
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

            <Overlay isVisible={filtersAreVisible} onBackdropPress={toggleFilterOverlay} overlayStyle={styles.filters_overlay}>
                <CustomText text={"Choose your filters:"} />
                <CheckBox title="Air con" checked={state["aircon"]} onPress={() => dispatch({ type: 'toggleAircon' })} />
                <CheckBox title="Less Noisy" checked={state["less_noise"]} onPress={() => dispatch({ type: 'toggleLessNoise' })} />
                <CheckBox title="Less crowded" checked={state["less_crowd"]} onPress={() => dispatch({ type: 'toggleLessCrowd' })} />
                <CheckBox title="Power plugs" checked={state["plugs"]} onPress={() => dispatch({ type: 'togglePlugs' })} />
                <CheckBox title="Snacks and drinks nearby" checked={state["snack&drink"]} onPress={() => dispatch({ type: 'toggleSnacksAndDrinks' })} />
                <CheckBox title="Wifi" checked={state["wifi"]} onPress={() => dispatch({ type: 'toggleWifi' })} />
                <CustomText text={`Minimum seat rating: ${state["minRating"]}`} textStyle={{fontWeight: 'bold', padding: 10}} />
                <Slider
                    value={state["minRating"]}
                    onValueChange={(newValue) => {dispatch({ type: 'toggleMinRating', payload: newValue });}}
                    maximumValue={5}
                    minimumValue={0}
                    step={1}
                    thumbStyle={{width: 30, height: 30}}
                />
                <Button title="Search" titleStyle={{fontSize: 12}} containerStyle={{paddingVertical: 15}} onPress={handleQuery} />
            </Overlay>
            
            <Screen scrollable={true}>
            {
                isFocused && panels
                    ? panels.map((panel, index) => (
                        <Panel key={index} panel={panel} />
                    ))
                    : (<></>)
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
    },

    filters_overlay: {
        width: '100%',
        height: '80%'
    }
})