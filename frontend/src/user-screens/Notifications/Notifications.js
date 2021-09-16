import React, { useEffect, useLayoutEffect, useState, useRef } from 'react';
import { FlatList } from 'react-native';
import Screen from '../../../misc_components/Screen';
import Panel from '../../../misc_components/Panel';
import { Button } from 'react-native-elements';
import { useIsFocused } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { subscribeToNotificationsChanges } from '../../../api/rtdb';
import { idSearch, transformToPanels } from '../../../backend/ElasticSearch';

export default function Notifications({ navigation }) {
    const [panels, setPanels] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const currentUserId = useSelector((state) => state.auth.currentUserId);
    const isFocused = useIsFocused();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (<Button title="Options" type="clear" onPress={() => navigation.navigate('GeneralNotificationsSettings')} titleStyle={{color: 'tomato'}} />),
            headerLeftContainerStyle: {
                alignItems: 'center',
                paddingLeft: 5
            },
            headerTitle: "Notifications"
        });
    }, [navigation]);

    useEffect(() => {
        return subscribeToNotificationsChanges(currentUserId,
            (notifications) => {
                // notifications is in the form { locationId1: deleteTime1, locationId2: deleteTime2, ... }
                if (notifications) {
                    const expiryTimes = Object.values(notifications);
                    idSearch(Object.keys(notifications),
                        // onSuccess callback
                        (results) => {
                            // Set the panels in the favourites tab
                            setPanels(transformToPanels(results).map((panel, index) => ({ ...panel, expiryTime: new Date(expiryTimes[index]).toLocaleString('en-SG'), notification: true })));
                        },
                        // onFailure callback
                        console.error
                    );
                } else {
                    setPanels([]);
                }
            }
        )
    }, []);

    function handleRefresh() {
        setIsRefreshing(true);
        idSearch(panels.map((panel, index) => panel.id),
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

    const renderPanel = ({ item, index, separators }) => {
        return (
            <Panel data={item} handleRefresh={handleRefresh} />
        );
    }

    return (
        <Screen>
            {isFocused && <FlatList data={panels} renderItem={renderPanel} keyExtractor={(item, index) => item.id} />}
        </Screen>
    );
}