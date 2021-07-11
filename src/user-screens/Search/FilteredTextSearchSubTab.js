import React, { useState, useRef, useReducer, useCallback } from 'react';
import Screen from '../../../misc_components/Screen';
import CustomText from '../../../misc_components/CustomText';
import Panel from "../../../misc_components/Panel";
import { StyleSheet, TextInput, View, Keyboard, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useIsFocused, useFocusEffect, useTheme } from '@react-navigation/native';
import { CheckBox, Slider, Overlay, Button } from 'react-native-elements';
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

export default function FilteredTextSearchSubTab(props) {
    const [query, setQuery] = useState('');
    const searchBox = useRef(null);
    const [panels, setPanels] = useState(null);
    const [filtersAreVisible, setFiltersAreVisible] = useState(false);
    const [state, dispatch] = useReducer(reducer, initialFilterState);
    const isFocused = useIsFocused();
    const { dark, colors } = useTheme();

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

            <Overlay isVisible={filtersAreVisible} onBackdropPress={toggleFilterOverlay} overlayStyle={{backgroundColor: colors.background, width: width, padding: 0, borderRadius: 10}}>
                <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: colors.card, borderRadius: 10, paddingVertical: 5}}>
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

                <View style={{paddingHorizontal: 10}}>
                    <CustomText text={"Choose your filters:"} />
                    <CheckBox title="Air con" checked={state["aircon"]} onPress={() => dispatch({ type: 'toggleAircon' })} textStyle={{color: colors.text}} containerStyle={{backgroundColor: colors.background}} />
                    <CheckBox title="Less Noisy" checked={state["less_noise"]} onPress={() => dispatch({ type: 'toggleLessNoise' })} textStyle={{color: colors.text}} containerStyle={{backgroundColor: colors.background}} />
                    <CheckBox title="Less crowded" checked={state["less_crowd"]} onPress={() => dispatch({ type: 'toggleLessCrowd' })} textStyle={{color: colors.text}} containerStyle={{backgroundColor: colors.background}} />
                    <CheckBox title="Power plugs" checked={state["plugs"]} onPress={() => dispatch({ type: 'togglePlugs' })} textStyle={{color: colors.text}} containerStyle={{backgroundColor: colors.background}} />
                    <CheckBox title="Snacks and drinks nearby" checked={state["snack&drink"]} onPress={() => dispatch({ type: 'toggleSnacksAndDrinks' })} textStyle={{color: colors.text}} containerStyle={{backgroundColor: colors.background}} />
                    <CheckBox title="Wifi" checked={state["wifi"]} onPress={() => dispatch({ type: 'toggleWifi' })} textStyle={{color: colors.text}} containerStyle={{backgroundColor: colors.background}} />
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
                    <Button title="Search" titleStyle={{fontSize: 12}} containerStyle={{paddingVertical: 15}} onPress={handleQuery} />
                </View>
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
    }
})