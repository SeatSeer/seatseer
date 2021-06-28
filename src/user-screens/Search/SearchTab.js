import React, { useState, useCallback, useRef, useEffect, useReducer } from 'react';
import Screen from '../../../misc_components/Screen';
import CustomText from '../../../misc_components/CustomText';
import Panel from "../../../misc_components/Panel";
import { StyleSheet, TextInput, View, Keyboard, Dimensions, Platform, KeyboardAvoidingView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { Button, CheckBox, Slider, Overlay } from 'react-native-elements';

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

    // useFocusEffect(useCallback(() => {
    //     /** @todo Fix bug where keyboard keeps popping up after search result is submitted */
    //     searchBox.current.focus();
    //     return () => searchBox.current.blur();
    // }))

    // useEffect(() => {
    //     if (panels) {
    //         props.setMarkers(panels.map((panel, index) => {
    //             return {
    //                 title: panel.avatar,
    //                 description: panel.name,
    //                 coordinates: panel.coordinates
    //             }
    //         }))
    //     } else {
    //         props.setMarkers(null);
    //     }
    // })

    function handleQuery() {
        Keyboard.dismiss();
        setFiltersAreVisible(false);
        const filtersArray = [{ "range": { "rating": { "gte": state["minRating"].toString() } } }];
        const url = `http://44.194.92.99:9200/seats/_search`
        let body;
        if (query === "") {
            body = {
                "query": {
                    "bool": {
                        "filter": filtersArray
                            .concat(Object.entries(state)
                                .filter(entry => entry[1] === true)
                                .map(entry => {
                                    return { "term": { "features": entry[0] } }
                                })),
                    }
                },
                "sort": {
                    "vacant_seats": "desc"
                }
            }
        } else {
            body = {
                "query": {
                    "bool": {
                        // "filter": [
                        //     { "range": { "rating": { "gte": "_value_" } } },
                        //     { "term": { "features": "_filterA_" } },
                        //     { "term": { "features": "_filterB_" } }
                        // ],
                        "filter": filtersArray
                            .concat(Object.entries(state)
                                .filter(entry => entry[1] === true)
                                .map(entry => {
                                    return { "term": { "features": entry[0] } }
                                })),
                        "must": {
                            "dis_max": {
                                "queries": [
                                    { "match_phrase_prefix": { "name": query } },
                                    { "match": { "related": query } }
                                ]
                            }
                        }
                    }
                },
                "sort": {
                    "vacant_seats": "desc"
                }
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
            console.log(dataArray);
            props.setMarkers(dataArray.map((data, index) => {
                return {
                    title: data._source.avatar,
                    description: data._source.name,
                    coordinates: {
                        latitude: parseFloat(data._source.location.lat),
                        longitude: parseFloat(data._source.location.lon)
                    }
                }
            }))
            setPanels(dataArray.map((data, index) => {
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
                panels
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