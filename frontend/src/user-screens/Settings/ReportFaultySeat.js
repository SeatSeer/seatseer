import React from 'react';
import SeatDetails from './report-faulty-seat-form/SeatDetails';
import Camera from './report-faulty-seat-form/Camera';
import FaultDetails from './report-faulty-seat-form/FaultDetails';
import { createStackNavigator } from '@react-navigation/stack';

const ReportFaultySeatFormStack = createStackNavigator();

export default function ReportFaultySeat() {
    return (
        <ReportFaultySeatFormStack.Navigator initialRouteName="">
            <ReportFaultySeatFormStack.Screen name="SeatDetails" component={SeatDetails} options={{title: "Report a fault", headerBackTitle: "Back"}} />
            <ReportFaultySeatFormStack.Screen name="Camera" component={Camera} options={{title: "Camera", headerBackTitle: "Back"}} />
            <ReportFaultySeatFormStack.Screen name="FaultDetails" component={FaultDetails} options={{title: "Fault Details", headerBackTitle: "Back"}} />
        </ReportFaultySeatFormStack.Navigator>
    )
}